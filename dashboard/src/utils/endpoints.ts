const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL as string;
export const cloudinaryApiPoint = process.env
  .NEXT_PUBLIC_CLOUDINARY_API as string;

if (!BASE_URL) {
  console.error("NEXT_PUBLIC_BACK_ENDPOINT environment variable is not set!");
}

const auth = "auth";
const users = "user";
const content = "content";
const media = "media";

const endpointMap = {
  login: `${auth}/login`,
  forgotPassword: `${auth}/forgotPassword`,
  forgotPasswordVerify: `${auth}/forgotPassword/verify`,
  forgotPasswordUpdate: `${auth}/forgotPassword/updatePassword`,

  // user
  getUsers: `${users}/getAllUsers`,
  getUserProfile: `${users}/getUserProfile`,
  createUser: `${users}/create`,
  updateUser: `${users}/updateUser/`,
  changeStatus: `${users}/switchStatus/`,
  getAuditLogs: `${auth}/logs`,

  //location
  getLocations: `${users}/locations`,

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
  },
};

export default endpoint;
