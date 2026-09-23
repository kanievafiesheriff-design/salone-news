import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import news from "../data/news";
import { getArticle, getArticleBySlug } from "../services/newsApi";
import {
  Share2,
  MessageCircle,
  Download,
} from "lucide-react";
import { Helmet } from "react-helmet-async";
import { getShareUrl, shareLink } from "../utils/shareUtils";

// Facebook icon
const FacebookIcon = (props) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M13.5 21.9v-7.9h2.7l.4-3.1h-3.1V8.7c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.4H7.6v3.1h2.7v7.9h3.2z" />
  </svg>
);

// X icon
const XIcon = (props) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...props}
  >
    <path d="M17.7 3H21l-7.1 8.1L22 21h-6.6l-5.2-6.8L4.3 21H1l7.6-8.7L2 3h6.8l4.7 6.2L17.7 3zm-1.2 16h1.8L7.7 4.9H5.8L16.5 19z" />
  </svg>
);

export default function Article() {
  const { id } = useParams();

  const [article, setArticle] = useState(() =>
    news.find(
      (item) =>
        String(item.id) === String(id) ||
        item.slug === id
    )
  );

  const [isLoading, setIsLoading] = useState(true);

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Download failed");
      }

      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "audio-clip.mp3";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  useEffect(() => {
    let cancelled = false;

    async function loadArticle() {
      setIsLoading(true);

      try {
        let response;
        try {
          response = await getArticle(id);
        } catch (idError) {
          response = await getArticleBySlug(id);
        }

        if (!cancelled) {
          const backendArticle = response?.data || response?.article || response;
          if (backendArticle) {
            setArticle(backendArticle);
          }
          // Note: If backendArticle is null/undefined, we do NOTHING.
          // This preserves the local mock data set in useState.
        }
      } catch (error) {
        console.error("API fetch failed, falling back to local data:", error);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (id) {
      loadArticle();
    } else {
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (isLoading && !article) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-gray-500">
          Loading story...
        </p>
      </section>
    );
  }

  if (!article) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Story not found
        </h1>

        <p className="mt-4 text-gray-500">
          The story could not be found.
        </p>

        <Link
          className="mt-5 inline-block font-semibold text-green-700 hover:underline"
          to="/news"
        >
          Browse all news
        </Link>
      </section>
    );
  }

  const shareUrl = window.location.href;

  const articleImage =
    article.images &&
    Array.isArray(article.images) &&
    article.images.length > 0
      ? article.images[0]
      : article.imageUrl ||
        article.image ||
        "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=85";

  return (
    <article className="mx-auto max-w-4xl px-4 py-16">
      <Helmet>
        <title>
          {article.title} | Salone News
        </title>

        <meta
          name="description"
          content={article.excerpt || ""}
        />

        <meta
          property="og:title"
          content={article.title || ""}
        />

        <meta
          property="og:description"
          content={article.excerpt || ""}
        />

        <meta
          property="og:image"
          content={articleImage}
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:url"
          content={shareUrl}
        />

        <meta
          property="og:type"
          content="article"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={article.title || ""}
        />
        <meta
          name="twitter:description"
          content={article.excerpt || ""}
        />
        <meta
          name="twitter:image"
          content={articleImage}
        />
      </Helmet>

      <p className="text-sm font-bold uppercase tracking-wider text-green-700">
        {article.category}
      </p>

      <h1 className="mt-3 text-4xl font-bold leading-tight text-gray-900 md:text-5xl">
        {article.title}
      </h1>

      <p className="mt-4 text-sm text-gray-500">
        {article.date || article.createdAt || ""}
        {" · "}
        {article.author || "Salone News"}
        {" · "}
        {article.location || "Sierra Leone"}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <span className="text-xs font-bold uppercase text-gray-400">
          Share story:
        </span>

        <button
          onClick={async () => {
            try {
              await shareLink(
                article.title,
                article.excerpt || "",
                shareUrl
              );
            } catch (e) {
              console.error("Native share failed, use individual buttons", e);
            }
          }}
          className="flex items-center gap-2 rounded-full bg-green-700 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-green-800"
        >
          <Share2 size={14} />
          Share Now
        </button>

        <a
          href={getShareUrl(
            "whatsapp",
            shareUrl,
            article.title
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-[#25D366] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#128C7E]"
        >
          <MessageCircle size={14} />
          WhatsApp
        </a>

        <a
          href={getShareUrl(
            "facebook",
            shareUrl,
            article.title
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-[#1877F2] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#145DBF]"
        >
          <FacebookIcon />
          Facebook
        </a>

        <a
          href={getShareUrl(
            "twitter",
            shareUrl,
            article.title
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-xs font-bold text-white transition hover:bg-gray-800"
        >
          <XIcon />
          X
        </a>

        <button
          onClick={() => {
            navigator.clipboard.writeText(shareUrl);
            alert("Link copied to clipboard!");
          }}
          className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 transition hover:bg-gray-200"
        >
          <Share2 size={14} />
          Copy Link
        </button>

        {article.audioUrl && (
          <button
            onClick={() =>
              handleDownload(
                article.audioUrl,
                `${article.title
                  .replace(/\s+/g, "-")
                  .toLowerCase()}.mp3`
              )
            }
            className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700 transition hover:bg-green-200"
          >
            <Download size={14} />
            Download Audio
          </button>
        )}
      </div>

      <img
        src={articleImage}
        alt={article.title || "Salone News story"}
        className="mt-8 h-80 w-full rounded-xl object-cover md:h-[30rem]"
      />

      {article.videoUrl && (
        <div className="mt-8">
          <video
            src={article.videoUrl}
            controls
            className="w-full rounded-xl shadow-lg"
            preload="metadata"
          />

          <p className="mt-2 text-center text-sm italic text-gray-500">
            Watch the full report
          </p>
        </div>
      )}

      <div className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-700">
        {article.excerpt && (
          <p>{article.excerpt}</p>
        )}

        {article.content && (
          <p className="mt-6">
            {article.content}
          </p>
        )}
      </div>
    </article>
  );
}