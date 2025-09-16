import NotFound from "./not-found";
import RenderPage from "./RenderPage";
import { getContentReq } from "@/functionalities/fetch";

// Map for location IDs
const locations: Record<string, string> = {
  "wicker-park": "e3e1077b-bfd3-468a-b260-58819005fdaa",
  "la-grange": "c994612d-9e5d-47a2-afb8-5388e5e7583e",
  "west-loop": "255cdf30-db19-4277-a550-27374d008dd2",
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
      ? await getContentReq("", locations[page], { cache: "no-store" })
      : await getContentReq(
          page ?? "",
          location ? locations[location] : undefined,
          { cache: "no-store" }
        );

  if (!response.ok) {
    return <NotFound />;
  }

  return <RenderPage initialData={response.webpage} slugParams={resolvedParams.slug} />;
}
