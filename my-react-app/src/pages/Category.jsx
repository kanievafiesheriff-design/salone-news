
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { getNewsByCategory } from "../services/newsApi";
import news from "../data/news";
import "../styles/Category.css";

const fallbackImage = "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=85";

function imageFor(article) {
  return article?.images?.[0] || article?.imageUrl || article?.image || fallbackImage;
}

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

  const categoryName = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : "News";
  const leadStory = categoryNews[0];
  const supportingStories = categoryNews.slice(1, 3);
  const remainingStories = categoryNews.slice(3);

  return (
    <main className="category-page">
      <section className="category-masthead">
        <div>
          <p className="category-kicker">SLNEWSBLOG / Section</p>
          <h1>{categoryName}</h1>
        </div>
        <p className="category-description">
          The latest {categoryName.toLowerCase()} news, reporting, and context from Sierra Leone and beyond.
        </p>
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
          <>
            <div className="category-layout">
            {leadStory && (
              <Link to={`/article/${leadStory._id || leadStory.id}`} className="category-lead">
                <div className="category-lead__image">
                  <img src={imageFor(leadStory)} alt={leadStory.title} />
                  <span className="category-label">Lead story</span>
                </div>
                <div className="category-lead__copy">
                  <p className="category-kicker">{leadStory.category} / {leadStory.date}</p>
                  <h2>{leadStory.title}</h2>
                  <p>{leadStory.excerpt}</p>
                  <span className="category-read">Read full story <ArrowUpRight size={16} /></span>
                </div>
              </Link>
            )}

            <div className="category-supporting">
              <div className="category-section-line"><span>In focus</span><span>{categoryNews.length} stories</span></div>
              {supportingStories.map((article) => (
                <Link key={article._id || article.id} to={`/article/${article._id || article.id}`} className="category-brief">
                  <img src={imageFor(article)} alt="" />
                  <div>
                    <p className="category-kicker">{article.category}</p>
                    <h3>{article.title}</h3>
                    <span className="category-meta"><Clock3 size={13} /> {article.time || article.date}</span>
                  </div>
                </Link>
              ))}
            </div>
            </div>

          {remainingStories.length > 0 && (
            <section className="category-latest">
              <div className="category-section-heading">
                <div><p className="category-kicker">The latest</p><h2>More {categoryName} reporting</h2></div>
                <span><MapPin size={14} /> Sierra Leone</span>
              </div>
              <div className="category-grid">
                {remainingStories.map((article, index) => (
                  <motion.article
                    key={article._id || article.id}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    className="category-card"
                  >
                    <Link to={`/article/${article._id || article.id}`}>
                      <div className="category-card__image"><img src={imageFor(article)} alt={article.title} /></div>
                      <div className="category-card__copy">
                        <p className="category-kicker">{article.category}</p>
                        <h3>{article.title}</h3>
                        <p>{article.excerpt}</p>
                        <span className="category-card__meta">{article.author || "SLNEWSBLOG"}<span>{article.date}</span></span>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </section>
            )}
          </>
        )}
      </section>
    </main>
  );
}
