const BASE_URL = "http://localhost:5000/";

const auth = "auth";
const role = "role";
const permission = "permission";
const user = "user";
const notification = "notification";
const content = "content";
const media = "media";
const reminder = "reminder"


const endpoint = {
    login: `${auth}/login`, // API for Auth


    route(route) {
        if (this[route]) {
            return BASE_URL + this[route];
        } else {
            throw new Error(`Route ${route} not found`);
        }
    },
};

export default endpoint;