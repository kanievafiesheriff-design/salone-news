
import { motion } from "framer-motion";
import news from "../data/news";
import NewsCard from "./NewsCard";

export default function TrendingNews() {
  const trendingNews = news
    .filter((article) => article.trending)
    .slice(0, 5);

  return (
    <div className="grid gap-6 lg:grid-cols-3">

      {/* Main trending story */}
      {trendingNews[0] && (
        <div className="lg:col-span-2">
          <NewsCard
            article={trendingNews[0]}
            variant="featured"
            index={0}
          />
        </div>
      )}

      {/* Trending list */}
      <div className="space-y-5">
        {trendingNews.slice(1).map((article, index) => (
          <NewsCard
            key={article._id || `${article.id}-${article.title}-${index}`}
            article={article}
            variant="compact"
            index={index}
          />
        ))}
      </div>

    </div>
  );
}
