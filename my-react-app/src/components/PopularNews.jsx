
import { motion } from "framer-motion";
import news from "../data/news";
import NewsCard from "./NewsCard";

export default function PopularNews() {
  const popularNews = [...news]
    .sort((a, b) => (b.views || b.id) - (a.views || a.id))
    .slice(0, 6);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {popularNews.map((article, index) => (
        <motion.div
          key={article._id || `${article.id}-${article.title}-${index}`}
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            delay: index * 0.08,
          }}
        >
          <NewsCard
            article={article}
            index={index}
          />
        </motion.div>
      ))}
    </div>
  );
}
