const BASE_URL = process.env.NEXT_PUBLIC_BACK_ENDPOINT as string;

export const cloudinaryApiPoint = process.env.NEXT_PUBLIC_CLOUDINARY_API as string

export const googleApi = process.env.NEXT_PUBLIC_GOOGLE_MAPS_NEW_API_KEY


const content = "/content";
const contact = "contact"


const endpointMap = {
    // content
    content: `${content}/route/`,

    contact: `${contact}/`

} as const;

type EndpointKey = keyof typeof endpointMap;

const endpoint = {
    ...endpointMap,

    route(route: EndpointKey): string {
        return BASE_URL + endpointMap[route];
    }
};

export default endpoint;
