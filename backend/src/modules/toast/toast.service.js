import prismaClient from "../../config/dbConfig.js";

export const getTokenByLoginToastPOS = async ({
    clientId,
    clientSecret,
    userAccessType,
    hostname,
}) => {
    const existingToken = await prismaClient.toastToken.findFirst({
        orderBy: { createdAt: "desc" },
    });

    const now = new Date();

    if (existingToken) {
        if (existingToken.expiresAt > now) {
            return existingToken.token; // token still valid
        } else {
            // token expired, delete it
            await prismaClient.toastToken.delete({ where: { id: existingToken.id } });
        }
    }

    // fetch new token
    const response = await fetch(hostname + "/authentication/v1/authentication/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, clientSecret, userAccessType }),
    });

    const data = await response.json();

    if (!data?.token?.accessToken || !data?.token?.expiresIn) {
        throw new Error("Invalid token response from Toast POS");
    }

    const accessToken = data.token.accessToken;
    const expiresAt = new Date(Date.now() + data.token.expiresIn * 1000);

    await prismaClient.toastToken.create({
        data: { token: accessToken, expiresAt },
    });

    return accessToken;
};


export const getMenuFromToastPOS = async ({ hostname, restaurantGuid, token }) => {
    const now = new Date();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    const latestMenu = await prismaClient.menu.findFirst({
        orderBy: { lastFetchedAt: "desc" },
        include: { menuGroups: { include: { menuItems: true } } },
    });

    if (!latestMenu || !latestMenu.lastFetchedAt || (now - new Date(latestMenu.lastFetchedAt) > twentyFourHours)) {
        // fetch from Toast POS
        const response = await fetch(hostname + "/menus/v2/menus/", {
            method: "GET",
            headers: {
                "Toast-Restaurant-External-Id": restaurantGuid,
                "Authorization": `Bearer ${token}`
            }
        });

        const menu = await response.json();
        return { cache: false, menu };
    } else {
        // return cached menu from DB
        return { cache: true, menu: latestMenu };
    }
}

export function simplifyMenu(menu) {
    return {
        menus: menu.menus.map(menuSection => ({
            id: menuSection.guid,
            name: menuSection.name,
            menuGroups: menuSection.menuGroups.map(group => ({
                id: group.guid,
                name: group.name,
                menuItems: group.menuItems.map(item => ({
                    id: item.guid,
                    name: item.name,
                    price: item.price || 0,
                    image: item.image || "",
                    active: true
                }))
            }))
        }))
    };
}



/**
 * READ: Fetch a menu with all groups and items
 */
export async function getMenu(menuId) {
    return await prismaClient.menu.findUnique({
        where: { id: menuId },
        include: {
            menuGroups: {
                include: {
                    menuItems: true,
                },
            },
        },
    });
}

/**
 * CREATE: Create a menu with nested groups and items
 */
export async function createMenu(menuData) {
    const { name, menuGroups } = menuData;

    return await prismaClient.menu.create({
        data: {
            name,
            menuGroups: {
                create: menuGroups.map((group) => ({
                    name: group.name,
                    menuItems: {
                        create: group.menuItems.map((item) => ({
                            name: item.name,
                            price: item.price,
                            active: item.active,
                            image: item.image,
                        })),
                    },
                })),
            },
        },
    });
}

/**
 * UPDATE / UPSERT: Update menu, groups, items; create if missing
 */
export async function updateMenu(menuData) {
    const { id, name, menuGroups } = menuData;

    // Update menu name
    if (name) {
        await prismaClient.menu.update({
            where: { id },
            data: { name },
        });
    }

    for (const group of menuGroups) {
        let groupId;

        if (group.id) {
            // Update existing group
            const updatedGroup = await prismaClient.menuGroup.update({
                where: { id: group.id },
                data: { name: group.name },
            });
            groupId = updatedGroup.id;
        } else {
            // Create new group
            const createdGroup = await prismaClient.menuGroup.create({
                data: { name: group.name, menuId: id },
            });
            groupId = createdGroup.id;
        }

        // Upsert items
        for (const item of group.menuItems) {
            if (item.id) {
                await prismaClient.menuItem.upsert({
                    where: { id: item.id },
                    update: {
                        name: item.name,
                        price: item.price,
                        active: item.active,
                        image: item.image,
                    },
                    create: {
                        name: item.name,
                        price: item.price,
                        active: item.active,
                        image: item.image,
                        menuGroupId: groupId,
                    },
                });
            } else {
                await prismaClient.menuItem.create({
                    data: {
                        name: item.name,
                        price: item.price,
                        active: item.active,
                        image: item.image,
                        menuGroupId: groupId,
                    },
                });
            }
        }
    }
}

// Example usage
// (async () => {
//   const menu = await createMenu({
//     name: 'Drinks',
//     menuGroups: [
//       {
//         name: 'Cocktails',
//         menuItems: [
//           { name: 'Mango Martini', price: 15, active: true, image: 'mango.png' },
//         ],
//       },
//     ],
//   });
//   console.log('Created Menu:', menu);

//   const fetched = await getMenu(menu.id);
//   console.log('Fetched Menu:', JSON.stringify(fetched, null, 2));

//   await updateMenu({
//     id: menu.id,
//     name: 'Drinks Updated',
//     menuGroups: [
//       {
//         id: menu.menuGroups[0].id,
//         name: 'Cocktails Updated',
//         menuItems: [
//           {
//             id: menu.menuGroups[0].menuItems[0].id,
//             name: 'Mango Martini Deluxe',
//             price: 16,
//             active: true,
//             image: 'mango-new.png',
//           },
//           {
//             name: 'New Cocktail',
//             price: 12,
//             active: true,
//             image: 'new.png',
//           },
//         ],
//       },
//     ],
//   });
// })();
