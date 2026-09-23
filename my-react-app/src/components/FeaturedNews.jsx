import { ArrowUpRight, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import news from "../data/news";

const fallbackImage = "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=85";

function imageFor(article) {
  return article?.images?.[0] || article?.imageUrl || article?.image || fallbackImage;
}

export default function FeaturedNews() {
  const stories = news.filter((article) => article.featured).slice(0, 3);
  const lead = stories[0] || news[0];
  const briefs = stories.slice(1);

  return (
    <section className="home-hero">
      <div className="home-hero__intro">
        <div>
          <p className="home-kicker">The daily brief</p>
          <h1>News that keeps Sierra Leone moving.</h1>
        </div>
        <p className="home-hero__dek">
          Independent reporting, useful context, and the stories shaping life across the country.
        </p>
      </div>

      <div className="home-lead-grid">
        <Link to={`/article/${lead.slug || lead.id}`} className="home-lead-story">
          <img src={imageFor(lead)} alt={lead.title} />
          <div className="home-lead-story__shade" />
          <div className="home-lead-story__copy">
            <span className="home-category">{lead.category || "Top story"}</span>
            <h2>{lead.title}</h2>
            <p>{lead.excerpt}</p>
            <span className="home-read-link">Read the story <ArrowUpRight size={16} /></span>
          </div>
        </Link>

        <div className="home-briefs">
          <div className="home-section-rule">
            <span>More from the desk</span>
            <span className="home-date">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
          </div>
          {briefs.map((article) => (
            <Link key={article.id || article.slug} to={`/article/${article.slug || article.id}`} className="home-brief">
              <img src={imageFor(article)} alt="" />
              <div>
                <span className="home-category">{article.category}</span>
                <h3>{article.title}</h3>
                <span className="home-meta"><Clock3 size={13} /> {article.time || "Today"}</span>
              </div>
            </Link>
          ))}
          <Link to="/news" className="home-all-link">See all stories <ArrowUpRight size={16} /></Link>
        </div>
      </div>

      <nav className="home-topic-strip" aria-label="News topics">
        {['Politics', 'Business', 'Health', 'Technology', 'Sports', 'Culture'].map((topic) => (
          <Link key={topic} to={`/category/${topic.toLowerCase()}`}>{topic}</Link>
        ))}
      </nav>
    </section>
  );
}
