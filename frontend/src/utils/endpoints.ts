const BASE_URL = process.env.NEXT_PUBLIC_BACK_ENDPOINT as string;

export const cloudinaryApiPoint = process.env.NEXT_PUBLIC_CLOUDINARY_API as string


const content = "/content";

const endpointMap = {
    // content
    content: `${content}/`,
} as const;

type EndpointKey = keyof typeof endpointMap;

const endpoint = {
    ...endpointMap,

    route(route: EndpointKey): string {
        return BASE_URL + endpointMap[route];
    }
};

export default endpoint;
