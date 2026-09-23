import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import "../styles/SiteChrome.css";

export default function Header() {
  return (
    <header className="site-masthead">
      <div className="site-masthead__inner">
        <div className="site-masthead__edition">
          <span>Wednesday, September 23, 2026</span>
          <span>Freetown · Sierra Leone</span>
        </div>
        <Link to="/" className="site-wordmark" aria-label="SLNEWSBLOG home">
          <span className="site-wordmark__mark">SL</span>
          <span>NEWSBLOG</span>
        </Link>
        <div className="site-masthead__utility">
          <span>Independent journalism</span>
          <Link to="/search" aria-label="Search stories" title="Search stories">
            <Search size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
