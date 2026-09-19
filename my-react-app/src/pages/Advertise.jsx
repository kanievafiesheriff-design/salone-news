import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, Globe, Zap, Mail, Phone } from 'lucide-react';

export default function Advertise() {
  const pricing = [
    {
      tier: "Starter",
      price: "SL 500",
      period: "per week",
      features: ["1 Sidebar Ad", "1 Weekly Mention", "Basic Analytics", "Email Support"],
      cta: "Get Started",
      highlight: false
    },
    {
      tier: "Professional",
      price: "SL 1,200",
      period: "per week",
      features: ["Top Header Banner", "2 Sidebar Ads", "Detailed Analytics", "Priority Support", "Social Media Share"],
      cta: "Go Pro",
      highlight: true
    },
    {
      tier: "Enterprise",
      price: "Custom",
      period: "per month",
      features: ["Full Site Takeover", "Dedicated Account Manager", "Custom Ad Placements", "Quarterly Reviews", "Premium Positioning"],
      cta: "Contact Us",
      highlight: false
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-green-900 text-white py-20 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Grow Your Brand with <span className="text-green-400">Salone News</span>
          </h1>
          <p className="mt-6 text-lg text-green-100 max-w-2xl mx-auto">
            Reach thousands of engaged readers across Sierra Leone. Place your brand in front of the people who matter most.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#pricing" className="bg-white text-green-900 px-8 py-3 rounded-full font-bold hover:bg-green-100 transition">
              View Pricing
            </a>
            <a href="#contact" className="bg-green-700 text-white px-8 py-3 rounded-full font-bold hover:bg-green-600 transition border border-green-500">
              Contact Sales
            </a>
          </div>
        </div>
      </section>

      {/* Why Advertise Section */}
      <section className="py-20 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Partner With Us?</h2>
            <div className="h-1 w-20 bg-green-700 mx-auto mt-4"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Massive Reach</h3>
              <p className="text-gray-600">Access a wide demographic of readers from Freetown to the provinces.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BarChart3 size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Targeted Audience</h3>
              <p className="text-gray-600">Place your ads in specific categories like Business, Politics, or Health.</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap size={32} />
              </div>
              <h3 className="text-xl font-bold mb-3">Instant Visibility</h3>
              <p className="text-gray-600">Get your message out immediately with our live breaking news and featured slots.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Advertising Plans</h2>
            <p className="mt-4 text-gray-600">Choose the plan that fits your business goals.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricing.map((plan) => (
              <div
                key={plan.tier}
                className={`relative p-8 rounded-2xl border transition hover:shadow-xl ${
                  plan.highlight
                    ? "bg-white border-green-600 shadow-lg scale-105 z-10"
                    : "bg-white border-gray-200"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.tier}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500 ml-2">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="text-green-600">✓</span> {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-lg font-bold transition ${
                  plan.highlight
                    ? "bg-green-700 text-white hover:bg-green-800"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to start?</h2>
          <p className="text-gray-600 mb-10">Our sales team is ready to help you create the perfect campaign for your brand.</p>

          <div className="grid sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 p-6 rounded-xl border border-gray-200 hover:border-green-600 transition cursor-pointer">
              <div className="bg-green-100 p-3 rounded-full text-green-700">
                <Mail size={24} />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold uppercase text-gray-400">Email Us</span>
                <span className="font-semibold text-gray-900">ads@salonenews.com</span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-6 rounded-xl border border-gray-200 hover:border-green-600 transition cursor-pointer">
              <div className="bg-green-100 p-3 rounded-full text-green-700">
                <Phone size={24} />
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold uppercase text-gray-400">Call Us</span>
                <span className="font-semibold text-gray-900">+232 76 000 000</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
