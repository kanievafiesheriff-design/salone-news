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

export async function shareLink(title, text, url) {
  if (!navigator.share) {
    throw new Error("Web Share API not supported");
  }

  try {
    await navigator.share({
      title,
      text,
      url,
    });
  } catch (error) {
    console.error("Sharing failed:", error);
    throw error;
  }
}
