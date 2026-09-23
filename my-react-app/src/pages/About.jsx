
import { motion } from "framer-motion";
import { ArrowRight, Check, MapPin, Users, BookOpen, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import aboutImage from "../assets/salone.jpeg";

const principles = [
  {
    title: "Local first",
    description:
      "We report from the communities where the story begins, making room for voices that are too often left out.",
    icon: MapPin,
  },
  {
    title: "Useful context",
    description:
      "We go beyond the headline to explain what changed, why it matters, and what happens next.",
    icon: BookOpen,
  },
  {
    title: "Earned trust",
    description:
      "We separate reporting from opinion, correct our mistakes, and treat every source with care.",
    icon: ShieldCheck,
  },
];

const stats = [
  ["9+", "News categories"],
  ["24/7", "News coverage"],
  ["100%", "Focused on Sierra Leone"],
];

export default function About() {
  return (
    <main className="min-h-screen bg-white text-gray-900">

      {/* HERO */}
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(22,163,74,0.25),transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-4xl"
          >
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-green-400">
              About SLNEWSBLOG
            </p>

            <h1 className="text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              News for a country{" "}
              <span className="text-green-400">in motion.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-300 sm:text-xl">
              SLNEWSBLOG is an independent newsroom telling clear,
              thoughtful stories about Sierra Leone and the people building
              its future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-gray-200 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {stats.map(([number, label], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="px-6 py-8 text-center"
            >
              <div className="text-3xl font-black text-green-700">
                {number}
              </div>

              <div className="mt-1 text-sm font-medium text-gray-500">
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* WHY WE ARE HERE */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-2xl"
          >
            <img
              src={aboutImage}
              alt="Freetown skyline with the Sierra Leone welcome sign"
              className="h-[420px] w-full object-cover transition duration-700 hover:scale-105 sm:h-[520px]"
            />
          </motion.div>

          {/* COPY */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
              Why we are here
            </p>

            <h2 className="mt-3 text-3xl font-black leading-tight text-gray-900 sm:text-4xl">
              A fuller picture of Sierra Leone.
            </h2>

            <div className="mt-6 space-y-5 text-base leading-8 text-gray-600">
              <p>
                Our country is changing quickly. New ideas are taking root in
                Freetown, provincial towns, and communities across the country.
                SLNEWSBLOG follows those changes with reporting that is
                grounded, curious, and made for real life.
              </p>

              <p>
                We believe good journalism should help people understand their
                world and take part in shaping it. That means asking better
                questions, listening carefully, and making complex issues
                easier to navigate.
              </p>
            </div>

            <Link
              to="/news"
              className="mt-8 inline-flex items-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Explore our news
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section
        id="principles"
        className="bg-gray-50 py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10 max-w-2xl"
          >
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
              Our approach
            </p>

            <h2 className="mt-2 text-3xl font-black text-gray-900 sm:text-4xl">
              What guides us
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Our reporting is built around the principles that we believe
              matter most to our readers.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-3">
            {principles.map((principle, index) => {
              const Icon = principle.icon;

              return (
                <motion.article
                  key={principle.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ y: -6 }}
                  className="rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-700">
                    <Icon size={23} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-gray-900">
                    {principle.title}
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    {principle.description}
                  </p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-green-700">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100">
                      <Check size={13} />
                    </span>

                    Our commitment
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMMUNITY */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl bg-green-700 p-8 text-white sm:p-10"
          >
            <Users size={32} />

            <h2 className="mt-6 text-3xl font-black">
              Stories that start with people.
            </h2>

            <p className="mt-4 leading-7 text-green-50">
              From Freetown to Bo, Kenema, Makeni and communities across
              Sierra Leone, we want our coverage to reflect the people,
              challenges, ideas and opportunities shaping the country.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl bg-gray-950 p-8 text-white sm:p-10"
          >
            <h2 className="text-3xl font-black">
              Journalism that helps you understand.
            </h2>

            <p className="mt-4 leading-7 text-gray-300">
              Headlines tell you what happened. Good journalism helps you
              understand why it happened, who it affects and what could happen
              next.
            </p>

            <Link
              to="/news"
              className="mt-7 inline-flex items-center gap-2 font-semibold text-green-400 transition hover:text-green-300"
            >
              Read the latest stories
              <ArrowRight size={17} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="contact"
        className="border-t border-gray-200 bg-white"
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8 lg:py-20">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-green-700">
              Stay close to the story
            </p>

            <h2 className="mt-2 max-w-2xl text-3xl font-black text-gray-900 sm:text-4xl">
              Good reporting belongs in the conversation.
            </h2>

            <p className="mt-3 text-gray-500">
              Have a story, correction, tip or question for SLNEWSBLOG?
            </p>
          </div>

          <a
            href="mailto:hello@salonenews.com"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800"
          >
            Get in touch
            <ArrowRight size={17} />
          </a>
        </div>
      </section>
    </main>
  );
}
