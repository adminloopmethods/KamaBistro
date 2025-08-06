const BASE_URL = process.env.NEXT_PUBLIC_BACK_ENDPOINT as string;

console.log(BASE_URL)

const auth = "auth";
const users = "users";
const content = "content";

const endpointMap = {
    login: `${auth}/login`,                 // Auth

    // user
    getUsers: `${users}/`,
    submitUser: `${users}/register`,
    updateUser: `${users}/`,
    changeStatus: `${users}/switchStatus/`,

    // content
    createContent: `${content}/`,
} as const;

type EndpointKey = keyof typeof endpointMap;

const endpoint = {
    ...endpointMap,

    route(route: EndpointKey): string {
        return BASE_URL + endpointMap[route];
    }
};

export default endpoint;
