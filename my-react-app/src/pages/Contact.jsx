import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  Globe2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { sendContactMessage } from "../services/newsApi";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: null, message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: "" });
    setIsSubmitting(true);

    try {
      await sendContactMessage(formData);
      setStatus({
        type: "success",
        message: "Your message has been sent successfully! Our team will get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-gray-50">
      {/* Hero */}
      <section className="bg-gray-950 px-4 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-green-400">
              Get in touch
            </p>

            <h1 className="text-4xl font-bold sm:text-5xl">
              Contact SLNEWSBLOG
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-300">
              Have a story tip, press inquiry, correction, partnership idea,
              or general question? Our team would like to hear from you.
            </p>
          </motion.div>
        </div >
      </section>

      {/* Contact section */}
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-3">
        {/* Contact information */}
        <motion.div
          initial={{ opacity: 0, x: -25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-1"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Newsroom
          </h2>

          <p className="mt-3 leading-7 text-gray-600">
            Reach the SLNEWSBLOG team for news tips, editorial inquiries,
            corrections, partnerships, and general questions.
          </p>

          <div className="mt-8 space-y-6">
            <ContactItem
              icon={Mail}
              title="Email"
              value="slnewsblog@info"
            />

            <ContactItem
              icon={Phone}
              title="Phone"
              value="+232 073131961"
            />

            <ContactItem
              icon={MapPin}
              title="Location"
              value="Freetown, Sierra Leone"
            />

            <ContactItem
              icon={Clock}
              title="Newsroom Hours"
              value="Monday – Friday, 8:00 AM – 5:00 PM"
            />
          </div >

          {/* Social media */}
          <div className="mt-10">
            <h3 className="font-semibold text-gray-900">
              Follow SLNEWSBLOG
            </h3>

            <div className="mt-4 flex gap-3">
              <SocialLink
                href="#"
                icon={Globe2}
                label="Facebook"
              />

              <SocialLink
                href="#"
                icon={Globe2}
                label="Twitter"
              />

              <SocialLink
                href="#"
                icon={Globe2}
                label="Instagram"
              />
            </div >
          </div >
        </motion.div>

        {/* Contact form */}
        <motion.div
          initial={{ opacity: 0, x: 25 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 sm:p-8 lg:col-span-2"
        >
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Send us a message
            </h2>

            <p className="mt-2 text-gray-600">
              Fill out the form below and our team will get back to you.
            </p>
          </div >

          {status.message && (
            <div
              className={`mb-6 flex items-center gap-3 rounded-xl p-4 ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                  : "bg-red-50 text-red-700 ring-1 ring-red-200"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle2 size={20} />
              ) : (
                <AlertCircle size={20} />
              )}
              <p className="text-sm font-medium">{status.message}</p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid gap-6 sm:grid-cols-2">
              <div >
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Full name
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div >

              <div >
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div >
            </div >

            <div >
              <label
                htmlFor="subject"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Subject
              </label>

              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                required
              >
                <option value="">Select a subject</option>
                <option value="news-tip">News tip</option>
                <option value="correction">Correction</option>
                <option value="press">Press inquiry</option>
                <option value="partnership">Partnership</option>
                <option value="advertising">Advertising</option>
                <option value="general">General inquiry</option>
              </select>
            </div >

            <div >
              <label
                htmlFor="message"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Message
              </label>

              <textarea
                id="message"
                name="message"
                rows="7"
                placeholder="Write your message..."
                value={formData.message}
                onChange={handleChange}
                className="w-full resize-none rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                required
              />
            </div >

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 font-semibold text-white transition hover:bg-green-800 sm:w-auto disabled:opacity-70"
            >
              <Send size={18} />
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </motion.div>
      </section>

      {/* Story tips */}
      <section className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="rounded-2xl bg-green-50 p-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Have a story tip?
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-gray-600">
              If you have information about an important development in your
              community, send it to our newsroom. Please provide as much
              verified information and supporting evidence as possible.
            </p>

            <a
              href="mailto:hello@salonenews.com"
              className="mt-5 inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-800"
            >
              <Mail size={18} />
              Contact the newsroom
            </a>
          </div >
        </div >
      </section>
    </main>
  );
}

function ContactItem({ icon: Icon, title, value }) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
        <Icon size={20} />
      </div >

      <div >
        <h3 className="font-semibold text-gray-900">
          {title}
        </h3>

        <p className="mt-1 text-sm leading-6 text-gray-600">
          {value}
        </p>
      </div >
    </div >
  );
}

function SocialLink({ href, icon: Icon, label }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition hover:border-green-600 hover:bg-green-600 hover:text-white"
    >
      <Icon size={18} />
    </a>
  );
}