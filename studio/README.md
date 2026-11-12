# Electric Shipwrights Society Sanity CMS
Codebase for https://rising-tide.sanity.studio

## Local development

### Add .env file
Make a copy of .env.example and add to the top level directory as .env. Once you are added to the Sanity project, the project ID can be found in https://www.sanity.io/manage → Rising Tide Research Foundation → project id. Anything prefixed with `SANITY_STUDIO` will be deployed to production.

```
SANITY_STUDIO_PROJECT_ID="<paste your project ID here>" # Required - The ID of your Sanity project
SANITY_STUDIO_DATASET="production" # Required - The dataset of your Sanity project
SANITY_STUDIO_PREVIEW_URL="" #Optional - defaults to http://localhost:3000
SANITY_STUDIO_STUDIO_HOST="" #Optional
SANITY_STUDIO_REVALIDATE_SECRET="" # Required for the Deploy tool's "Publish content" — must match SANITY_REVALIDATE_SECRET on the production Netlify site
SANITY_STUDIO_PRODUCTION_SITE_URL="" #Optional - defaults to https://solander38.com
```

## Deploy tool
The **Deploy** tool in the Studio's top bar pushes published content to the production site. **Publish content** calls `/api/revalidate` on the production site, which refreshes every page within seconds without a rebuild. Until someone presses it, production keeps showing the content from its last refresh or build. The preview site doesn't need it, because it always shows the latest published content.

Code changes and new files in `frontend/public/` (models, drawings, stills) reach production through a `git push`, which triggers a full Netlify build.

`SANITY_STUDIO_REVALIDATE_SECRET` is bundled into the deployed Studio's JavaScript like every other `SANITY_STUDIO_` variable. Anyone who extracts it can only make the site refresh its pages.

### Install dependencies and run locally
```bash
npx install
```

```bash
npm run dev
```

This will serve the project from http://localhost:3333/.

## Deploy from command line
Deploy local schema to studio instance.
```
npx sanity deploy
```

## Check usage stats at
https://<projectId>.api.sanity.io/v1/data/stats/<datasetName>
