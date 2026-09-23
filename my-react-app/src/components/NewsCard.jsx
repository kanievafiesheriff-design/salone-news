import { Link } from "react-router-dom";

export default function NewsCard({ article, variant = "default" }) {
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";
  const articleId = article._id || article.id;
  const image = (article.images && article.images.length > 0)
    ? article.images[0]
    : (article.image?.trim() || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80");

  return (
    <Link
      to={`/article/${articleId}`}
      className={
        isCompact
          ? "flex gap-4 border-b border-gray-200 pb-5"
          : isFeatured
            ? "block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            : "block overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg"
      }
    >
      <div className={isCompact ? "h-20 w-28 shrink-0" : "block"}>
        <img
          src={image}
          alt=""
          className={
            isCompact
              ? "h-full w-full rounded-lg object-cover"
              : isFeatured
                ? "h-62 w-full object-cover"
                : "h-42 w-full object-cover"
          }
        />
      </div>

      <div className={isCompact ? "min-w-0" : "p-5"}>
        <p className="text-xs font-bold uppercase tracking-wider text-green-700">
          {article.category}
        </p>
        <h3
          className={
            isCompact
              ? "mt-1 line-clamp-2 text-base font-bold text-gray-900"
              : "mt-2 text-xl font-bold leading-tight text-gray-900"
          }
        >
          {article.title}
        </h3>
        {!isCompact && (
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
            {article.excerpt}
          </p>
        )}
        <p className="mt-3 text-xs text-gray-500">{article.date}</p>
      </div>
    </Link>
  );
}