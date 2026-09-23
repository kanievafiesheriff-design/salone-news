
import React, { useEffect, useState } from "react";
import news from "../data/news";
import NewsCard from "./NewsCard";
import AdCard from "./AdCard";
import { getNews } from "../services/newsApi";

export default function LatestNews() {
  const [latestNews, setLatestNews] = useState(news.slice(0, 6));

  useEffect(() => {
    getNews({ limit: 6 }).then((response) => setLatestNews(response.data || [])).catch(() => {});
  }, []);

  return (
    <section className="home-latest-section">
      <div className="home-category-heading">
        <div>
          <p className="home-kicker">Just in</p>
          <h2>Latest stories</h2>
        </div>
        <span className="home-feed-status">Updated throughout the day</span>
      </div>
      <div className="home-latest-grid">
      {latestNews.map((article, index) => (
        <React.Fragment key={article._id || article.id || `${article.title}-${index}`}>
          {article.isAd ? (
            <AdCard
              size="compact"
              title={article.title}
              description={article.excerpt}
              image={article.image}
              link={article.adLink || `/article/${article._id || article.id}`}
            />
          ) : (
              <NewsCard article={article} index={index} />
          )}
        </React.Fragment>
      ))}
      </div>
    </section>
  );
}
