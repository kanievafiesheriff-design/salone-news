
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getNewsByCategory } from "../services/newsApi";
import news from "../data/news";

export default function Category() {
  const { category } = useParams();
  const [categoryNews, setCategoryNews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setIsLoading(true);
    getNewsByCategory(category)
      .then((response) => {
        const apiNews = response.data || [];
        // Merge API news with static news from news.js
        const staticNews = news.filter(
          (article) => article.category.toLowerCase() === category.toLowerCase()
        );

        // Use a Map to deduplicate by slug or ID
        const allNews = [...apiNews, ...staticNews];
        const uniqueNews = Array.from(
          new Map(allNews.map(item => [`${item.slug || item.id}`, item])).values()
        );

        setCategoryNews(uniqueNews);
      })
      .catch((err) => {
        // If API fails, still show static news
        const staticNews = news.filter(
          (article) => article.category.toLowerCase() === category.toLowerCase()
        );
        setCategoryNews(staticNews);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [category]);

  const categoryName =
    category.charAt(0).toUpperCase() + category.slice(1);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <span className="text-sm font-bold uppercase tracking-wider text-green-700">
            SLNEWSBLOG
          </span>

          <h1 className="mt-2 text-4xl font-extrabold text-gray-900">
            {categoryName} News
          </h1>

          <p className="mt-3 max-w-2xl text-gray-500">
            Latest {categoryName.toLowerCase()} news, stories,
            updates and developments from Sierra Leone and beyond.
          </p>
        </div>
      </section>

      {/* Articles */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-700 border-t-transparent"></div>
          </div>
        ) : error ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">Something went wrong</h2>
            <p className="mt-2 text-gray-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
            >
              Retry
            </button>
          </div>
        ) : categoryNews.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              No news found
            </h2>

            <p className="mt-2 text-gray-500">
              There are currently no articles in this category.
            </p>

            <Link
              to="/news"
              className="mt-5 inline-block rounded-lg bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"
            >
              Browse All News
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categoryNews.map((article, index) => (
              <motion.article
                key={article._id || article.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <Link to={`/article/${article._id || article.id}`}>
                  <div className="h-40 overflow-hidden">
                    <img
                      src={article.image?.trim() || "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80"}
                      alt={article.title}
                      className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="p-4">
                    <span className="text-xs font-bold uppercase text-green-700">
                      {article.category}
                    </span>

                    <h2 className="mt-2 line-clamp-2 text-lg font-bold text-gray-900 hover:text-green-700">
                      {article.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                      {article.excerpt}
                    </p>

                    <div className="mt-5 flex justify-between text-xs text-gray-500">
                      <span>{article.author}</span>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
