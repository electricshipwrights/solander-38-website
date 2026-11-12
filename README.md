# Solander 38 website
Codebase for both the website CMS and UI/front end. Using https://github.com/sanity-io/sanity-template-nextjs-clean as template.

<!-- <img src="./architecture-diagram.svg" /> -->

### CMS (Sanity Studio)
[/studio/](/studio/) — [README](studio/README.md)

https://rising-tide.sanity.studio


### Front end (Next.js/React)
[/frontend/](/frontend/) — [README](frontend/README.md)

### Deployments

Two separate Netlify sites share the same codebase and Sanity dataset but behave differently based on `NEXT_PUBLIC_PREVIEW_SITE`.

| | Preview | Production |
|--|---------|------------|
| Site | https://solander38-preview.netlify.app | https://solander38.com |
| Build trigger | git push (auto) | git push (auto) |
| Content updates | Live, no action needed | Manual — Studio Deploy tool |
| Content | Published | Published |
| Content freshness | SSR on every request + Sanity Live API (SSE) | SSG at build, refreshed on demand via `/api/revalidate` |
| `NEXT_PUBLIC_PREVIEW_SITE` | `true` | _(not set)_ |

**Production content only changes when someone presses Publish content in the Studio's Deploy tool** (or on the next `git push`, which rebuilds with whatever is published). There is no Sanity webhook, so publishing a document doesn't touch production on its own.

Publish content sends a POST to `/api/revalidate` on the production site, which clears the Next.js cache for every page. Pages re-render with the latest published content on their next request, with no rebuild. The request is authorized with a shared secret: `SANITY_STUDIO_REVALIDATE_SECRET` in the Studio must match `SANITY_REVALIDATE_SECRET` on the production Netlify site.

The preview site picks up newly published content without a rebuild at all: it bypasses the Next.js data cache and subscribes to the Sanity Live API.

Neither site renders drafts — the client pins `perspective: "published"` in both cases. Preview differs in freshness, not in what it is allowed to see. Pages on both sites read from the live Sanity API rather than the API CDN, which can lag a publish by up to a minute. Search (`/api/search`) uses the CDN. It queries Sanity on every search, so it can show published content before Publish content has been pressed.

---

### Python scripts
[/scripts/](/scripts/) — [README](scripts/README.md)

Rhino export and post-processing pipeline: per-layer GLB export, leftover-mesh cleanup, STEP-to-GLB conversion for CAD that lives outside the Rhino model, GLB optimization, material extraction, PDF-to-PNG conversion, manifest copying, and Sanity reference audit.

The pipeline finishes in the front end with `npm run stills`, which re-renders the model stills used on the homepage, the stories index, and story Open Graph previews — see [frontend/README](frontend/README.md#regenerating-model-stills).

---

### License

© 2025-2026 Electric Shipwrights Society. This repository is dual-licensed.

| | License | Covers |
|--|---------|--------|
| **Code** | [MIT](LICENSE) | Everything in `frontend/app/`, `frontend/sanity/`, `studio/`, and `scripts/`: the Next.js front end, the Sanity Studio and schemas, and the Rhino export/optimization pipeline |
| **Content & 3D assets** | [CC BY 4.0](LICENSE-CC-BY-4.0) | Everything under `frontend/public/`: the exported GLB models (`models*/`, `models-jig*/`, `models-battery*/`), technical drawings, photographs, logos, and generated manifests — and all editorial content authored in Sanity (stories, captions, component data) |

Both licenses require attribution: credit **Electric Shipwrights Society** and link back to this repository or https://solander38.com.

Third-party assets are excluded from the above and retain their original licenses — notably the HDRI environment maps in `frontend/public/hdri/` ([Poly Haven](https://polyhaven.com), CC0) and the `gltfpack` binary in `scripts/` ([meshoptimizer](https://github.com/zeux/meshoptimizer), MIT).
