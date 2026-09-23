import { useEffect, useState } from "react";
import NewsCard from "../components/NewsCard";
import news from "../data/news";
import { getNews, getAds } from "../services/newsApi";
import AdCard from "../components/AdCard";
import "../styles/News.css";

export default function News() {
  const [articles, setArticles] = useState(news);

  const [ads, setAds] = useState({
    news_top: [],
    news_sidebar: [],
  });

  useEffect(() => {
    // Fetch news
    getNews({ limit: 50 })
      .then((response) => {
        setArticles(response?.data || []);
      })
      .catch((error) => {
        console.error("Failed to load news:", error);
      });

    // Fetch advertisements
    Promise.all([
      getAds("news_top")
        .then((response) => ({
          slot: "news_top",
          data: response?.data || [],
        }))
        .catch(() => ({
          slot: "news_top",
          data: [],
        })),

      getAds("news_sidebar")
        .then((response) => ({
          slot: "news_sidebar",
          data: response?.data || [],
        }))
        .catch(() => ({
          slot: "news_sidebar",
          data: [],
        })),
    ]).then((results) => {
      const adMap = {
        news_top: [],
        news_sidebar: [],
      };

      results.forEach((result) => {
        adMap[result.slot] = result.data;
      });

      setAds(adMap);
    });
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      {/* Page Header */}
      <div className="mb-8 border-b border-gray-200 pb-5">
        <p className="text-sm font-bold uppercase tracking-wider text-green-700">
          SLNEWSBLOG
        </p>

        <h1 className="mt-2 text-4xl font-bold text-gray-900">
          Latest News
        </h1>

        <p className="mt-3 text-gray-600">
          News and reporting from across Sierra Leone.
        </p>
      </div>

      {/* News Top Advertisement */}
      {ads.news_top.length > 0 && (
        <div className="mb-12">
          {ads.news_top.map((ad) => (
            <AdCard
              key={ad._id || ad.id}
              id={ad._id || ad.id}
              image={ad.imageUrl}
              title="Sponsored"
              description={ad.title}
              link={ad.externalLink}
              size={ad.adSize}
            />
          ))}
        </div>
      )}

      {/* News Articles */}
      <div className="news-card-grid grid gap-3 sm:grid-cols-4 lg:grid-cols-4">
        {articles.map((article, index) => (
          <NewsCard
            key={
              article._id ||
              article.id ||
              `${article.title}-${index}`
            }
            article={article}
            index={index}
          />
        ))}
      </div>

      {/* News Sidebar / Bottom Advertisements */}
      {ads.news_sidebar.length > 0 && (
        <div className="mt-12 border-t border-gray-100 pt-8">
          <h3 className="mb-4 px-2 text-xs font-bold uppercase tracking-wider text-gray-400">
            Sponsored
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {ads.news_sidebar.map((ad) => (
              <AdCard
                key={ad._id || ad.id}
                id={ad._id || ad.id}
                image={ad.imageUrl}
                title="Sponsored"
                description={ad.title}
                link={ad.externalLink}
                size={ad.adSize}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}