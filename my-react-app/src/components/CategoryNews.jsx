
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import news from "../data/news";
import { getNews } from "../services/newsApi";

const fallbackImage = "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=900&q=80";

function imageFor(article) {
  return article?.images?.[0] || article?.imageUrl || article?.image || fallbackImage;
}

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

  const lead = categoryNews[0];
  const secondary = categoryNews.slice(1, 3);

  return (
    <section className="home-category-section">
      <div className="home-category-heading">
        <div>
          <p className="home-kicker">Section report</p>
          <h2>{title || `${category} News`}</h2>
        </div>
        <Link to={`/category/${category.toLowerCase()}`}>View all <span aria-hidden="true">↗</span></Link>
      </div>

      <div className="home-category-layout">
        {lead && (
          <Link to={`/article/${lead._id || lead.id}`} className="home-category-lead">
            <div className="home-category-image"><img src={imageFor(lead)} alt={lead.title} /></div>
            <p className="home-kicker">{lead.category} · {lead.date}</p>
            <h3>{lead.title}</h3>
            <p className="home-category-excerpt">{lead.excerpt}</p>
            <span className="home-read-more">Read more <span aria-hidden="true">↗</span></span>
          </Link>
        )}

        <div className="home-category-secondary">
          {secondary.map((article) => (
            <Link key={article._id || `${article.id}-${article.title}`} to={`/article/${article._id || article.id}`} className="home-category-brief">
              <img src={imageFor(article)} alt="" />
              <div>
                <p className="home-kicker">{article.category}</p>
                <h3>{article.title}</h3>
                <span>{article.author || "SLNEWSBLOG"} · {article.date}</span>
                <strong className="home-read-more">Read more <span aria-hidden="true">↗</span></strong>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
