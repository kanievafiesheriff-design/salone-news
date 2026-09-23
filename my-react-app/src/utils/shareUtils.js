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

export async function shareWithImage(title, text, url, imagePath) {
  if (!navigator.share) {
    throw new Error("Web Share API not supported");
  }

  try {
    // 1. Try to fetch the image as a file for the "attachment" experience
    const response = await fetch(imagePath);
    const blob = await response.blob();
    const file = new File([blob], "article-image.jpg", { type: blob.type });

    // 2. Check if the browser supports sharing files
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: title,
        text: text,
        url: url,
      });
    } else {
      // 3. Fallback to sharing just the link (which uses OG tags for the thumbnail)
      await navigator.share({
        title: title,
        text: text,
        url: url,
      });
    }
  } catch (error) {
    console.error("Sharing failed:", error);
    // Final fallback: just share the link if fetching the image failed
    try {
      await navigator.share({ title, text, url });
    } catch (finalError) {
      throw finalError;
    }
  }
}
