import { createClient } from "next-sanity";
import { token } from "./token";
import { projectId, dataset, apiVersion, studioUrl } from "./api";

const isPreviewSite = process.env.NEXT_PUBLIC_PREVIEW_SITE === "true";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // the CDN can lag a publish by ~60s, which would let /api/revalidate
  // re-render pages with the old content
  useCdn: false,
  perspective: "published",
  token,
  stega: {
    enabled: isPreviewSite,
    studioUrl,
    filter: (props) => {
      if (props.sourcePath.at(-1) === "title") {
        return true;
      }

      return props.filterDefault(props);
    },
  },
});
