export function getShareUrl(platform, url, title) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const platforms = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%0A%0A${encodedUrl}`,
  };

  return platforms[platform] || null;
}

export function getCrawlerShareUrl(slug) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
  const backendUrl = apiUrl.replace(/\/api\/?$/, "").replace(/\/$/, "");
  return `${backendUrl}/share/${encodeURIComponent(slug)}`;
}

export async function shareWithImage(title, text, url) {
  if (!navigator.share) {
    throw new Error("Web Share API not supported");
  }

  // Share the metadata URL so WhatsApp and other platforms can build the preview card.
  // The image is already exposed through the URL's Open Graph tags.
  await navigator.share({ title, text, url });
}
