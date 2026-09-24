# Deployment

Build the frontend with `npm run build` from `frontend`, then start the API with `npm start` from `backend`.

For social share thumbnails, set these backend environment variables in production:

```env
PUBLIC_SITE_URL=https://slnewsblog.info
API_PUBLIC_URL=https://your-backend-domain.onrender.com
```

The `/share/:slug` endpoint returns article-specific Open Graph metadata for WhatsApp, Facebook, Messenger, and Telegram, then redirects human visitors to the normal article page.
