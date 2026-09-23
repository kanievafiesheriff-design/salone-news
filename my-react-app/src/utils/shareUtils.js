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

export async function shareWithFile(title, text, url, imagePath) {
  if (!navigator.share) {
    throw new Error("Web Share API not supported");
  }

  try {
    const response = await fetch(imagePath);
    const blob = await response.blob();
    const file = new File([blob], "share-image.jpg", { type: blob.type });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title,
        text,
        url,
      });
    } else {
      // Fallback to sharing without file if file sharing isn't supported
      await navigator.share({
        title,
        text,
        url,
      });
    }
  } catch (error) {
    console.error("Sharing failed:", error);
    throw error;
  }
}
