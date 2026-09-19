import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold text-gray-900">Page not found</h1>
      <Link className="mt-6 inline-block text-green-700 hover:underline" to="/">
        Return home
      </Link>
    </section>
  );
}
