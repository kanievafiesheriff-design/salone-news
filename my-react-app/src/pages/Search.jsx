export default function Search() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-4xl font-bold text-gray-900">Search</h1>
      <input
        className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
        type="search"
        placeholder="Search SLNEWSBLOG"
        aria-label="Search SLNEWSBLOG"
      />
    </section>
  );
}
