
import { Link } from "react-router-dom";

export default function MobileNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white md:hidden">
      <div className="grid grid-cols-4">
        <Link
          to="/"
          className="flex flex-col items-center py-3 text-xs text-gray-700"
        >
          <span>⌂</span>
          Home
        </Link>

        <Link
          to="/news"
          className="flex flex-col items-center py-3 text-xs text-gray-700"
        >
          <span>📰</span>
          News
        </Link>

        <Link
          to="/search"
          className="flex flex-col items-center py-3 text-xs text-gray-700"
        >
          <span>⌕</span>
          Search
        </Link>

        <Link
          to="/about"
          className="flex flex-col items-center py-3 text-xs text-gray-700"
        >
          <span>☰</span>
          More
        </Link>
      </div>
    </nav>
  );
}
