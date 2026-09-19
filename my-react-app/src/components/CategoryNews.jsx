
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import news from "../data/news";
import { getNews } from "../services/newsApi";
import AdCard from "./AdCard";

export default function CategoryNews({
  category,
  title,
  limit = 6,
}) {
  const fallbackNews = news
    .filter(
      (article) =>
        article.category.toLowerCase() === category.toLowerCase()
    )
    .slice(0, limit);
  const [categoryNews, setCategoryNews] = useState(fallbackNews);

  useEffect(() => {
    getNews({ category, limit })
      .then((response) => {
        const apiNews = response.data || [];
        const staticNews = news.filter(
          (article) => article.category.toLowerCase() === category.toLowerCase()
        );

        const allNews = [...apiNews, ...staticNews];
        const uniqueNews = Array.from(
          new Map(allNews.map(item => [`${item.slug || item.id}`, item])).values()
        );

        setCategoryNews(uniqueNews.slice(0, limit));
      })
      .catch(() => {
        // Fallback to static news is already handled by initial state,
        // but we can re-filter to be sure.
        const staticNews = news.filter(
          (article) => article.category.toLowerCase() === category.toLowerCase()
        );
        setCategoryNews(staticNews.slice(0, limit));
      });
  }, [category, limit]);

  if (categoryNews.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Section heading */}
      <div className="mb-6 flex items-end justify-between border-b border-gray-200 pb-3">
        <div>
          <span className="text-sm font-bold uppercase tracking-wider text-green-700">
            {category}
          </span>

          <h2 className="mt-1 text-2xl font-extrabold text-gray-900 sm:text-3xl">
            {title || `${category} News`}
          </h2>
        </div>

        <Link
          to={`/category/${category.toLowerCase()}`}
          className="text-sm font-semibold text-green-700 transition hover:text-green-900"
        >
          View All →
        </Link>
      </div>

      {/* News grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categoryNews.map((article, index) => (
          <React.Fragment key={article._id || `${article.id}-${article.title}-${index}`}>
            {article.isAd ? (
              <AdCard
                title={article.title}
                description={article.excerpt}
                image={article.image}
                link={article.adLink || `/article/${article._id || article.id}`}
              />
            ) : (
              <motion.article
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.45,
                  delay: index * 0.06,
                }}
                whileHover={{ y: -5 }}
                className="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-xl"
              >
                <Link to={`/article/${article._id || article.id}`} className="block h-full">
                  <div className="relative h-56 overflow-hidden">
                    <motion.img
                      src={article.image?.trim() || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80"}
                      alt={article.title}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.07 }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-green-700 px-3 py-1 text-xs font-bold uppercase text-white">
                      {article.category}
                    </span>
                  </div>
                  <div className="p-5">
                    <h3 className="line-clamp-2 text-xl font-bold leading-tight text-gray-900 transition-colors group-hover:text-green-700">
                      {article.title}
                    </h3>
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                      {article.excerpt}
                    </p>
                    <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                      <span>{article.author}</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
