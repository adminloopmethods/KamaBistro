import NotFound from "./not-found";
import RenderPage from "./RenderPage";
import { getContentReq } from "@/functionalities/fetch";

// Map for location IDs
const locations: Record<string, string> = {
  "wicker-park": "d49e33be-6e64-4a67-8b29-808400df991d",
  "la-grange": "7ff29022-fcbf-4206-b36b-c678b1bf4fea",
  "west-loop": "529f4b30-463e-4d12-a116-1529418f6982",
};

function detectSlug(slug?: string[]): [string, string?] {
  if (!slug) return [""];
  return slug.length > 1 ? [slug[1], slug[0]] : [slug[0]];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const [page, location] = detectSlug(resolvedParams.slug);

  const response: any =
    resolvedParams.slug?.length === 1 && locations[page]
      ? await getContentReq("", page, { cache: "no-store" })
      : await getContentReq(
        page ?? "",
        location ? location : undefined,
        { cache: "no-store" }
      );

  if (!response.ok) {
    return <NotFound />;
  }

  return <RenderPage initialData={response.webpage} slugParams={resolvedParams.slug} />;
}
