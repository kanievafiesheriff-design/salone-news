# Deployment

Build the frontend with `npm run build` from `frontend`, then start the API with `npm start` from `backend`.

For social share thumbnails, set the backend environment variable `PUBLIC_SITE_URL` to the public frontend URL, for example `https://sierra-loaded.sl`. The `/share/:slug` endpoint returns article-specific Open Graph metadata for WhatsApp and other crawlers, then redirects human visitors to the normal article page.
