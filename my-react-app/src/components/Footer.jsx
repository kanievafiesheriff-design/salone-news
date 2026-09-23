
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-3">
        <div>
          <h2 className="text-2xl font-bold text-green-500">
            SLNEWSBLOG
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-400">
            Your trusted source for news, information and stories
            from Sierra Leone, Africa and around the world.
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Quick Links</h3>

          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <Link to="/">Home</Link>
            <Link to="/news">Latest News</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Categories</h3>

          <div className="flex flex-col gap-2 text-sm text-gray-400">
            <Link to="/category/politics">Politics</Link>
            <Link to="/category/business">Business</Link>
            <Link to="/category/sports">Sports</Link>
            <Link to="/category/technology">Technology</Link>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">
        © 2026 SLNEWSBLOG. All rights reserved.
      </div>
    </footer>
  );
}
