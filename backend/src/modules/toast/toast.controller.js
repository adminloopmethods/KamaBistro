import {
    getTokenByLoginToastPOS,
    getMenuFromToastPOS,
    simplifyMenu
} from "./toast.service.js";

export const toastFetchController = async (req, res) => {
    try {
        // collect the toast related variables from env
        const clientId = process.env.clientId;
        const clientSecret = process.env.clientSecret;
        const userAccessType = process.env.userAccessType;
        const restaurantGuid = process.env.restaurantGuid;
        const hostname = process.env.hostname;

        //check that there should be no toast related variable should be missing
        if (!clientId || !clientSecret || !userAccessType || !restaurantGuid || !hostname) {
            return res.status(500).json({ error: "Unable to fetch the environment variables" });
        }

        // login and get the token for authorization
        const token = await getTokenByLoginToastPOS({ clientId, clientSecret, userAccessType, hostname });

        // get the full menu from toast using the "token"
        const fullMenu = await getMenuFromToastPOS({ hostname, restaurantGuid, token })

        // format the fullMenu so we can have only the neccessary fields
        const formatMenu = simplifyMenu(fullMenu);

        res.status(201).json({ success: true, formatMenu });
    } catch (error) {
        console.error("Error fetching toast menu:", error);
        res.status(500).json({ error });
    }
};
