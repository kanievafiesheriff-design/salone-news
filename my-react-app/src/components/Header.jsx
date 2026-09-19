import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <Link to="/" className="text-2xl font-bold text-green-700">
          SL News blog
        </Link>
        <Link to="/search" className="text-sm text-gray-600 hover:text-green-700">
          Search
        </Link>
      </div>
    </header>
  );
}
