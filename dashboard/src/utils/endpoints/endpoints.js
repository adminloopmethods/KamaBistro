const BASE_URL = import.meta.env.VITE_BACK_ENDPOINT;

const auth = "auth";
const users = "users"


const endpoint = {
    login: `${auth}/login`, // API for Auth

    // user
    getUsers: `${users}/`,
    submitUser: `${users}/register`,
    updateUser: `${users}/`,

    route(route) {
        if (this[route]) {
            return BASE_URL + this[route];
        } else {
            throw new Error(`Route ${route} not found`);
        }
    },
};

export default endpoint;