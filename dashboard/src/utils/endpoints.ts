const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
export const cloudinaryApiPoint = process.env.NEXT_PUBLIC_CLOUDINARY_API

if (!BASE_URL) {
  console.error("NEXT_PUBLIC_BACK_ENDPOINT environment variable is not set!");
}

console.log(BASE_URL);

const auth = "auth";
const users = "users";
const content = "content";
const media = "media";


const endpointMap = {
  login: `${auth}/login`,                 // Auth

  // user
  getUsers: `${users}/`,
  submitUser: `${users}/register`,
  updateUser: `${users}/`,
  changeStatus: `${users}/switchStatus/`,

  // content
  createContent: `${content}/`,

  // Media
  uploadMedia: `${media}/upload`,
  deleteMedia: `${media}/delete`,
  getMedia: `${media}/getMedia`,
} as const;

type EndpointKey = keyof typeof endpointMap;

const endpoint = {
  ...endpointMap,

  route(route: EndpointKey): string {
    return BASE_URL + endpointMap[route];
  }
};

export default endpoint;
