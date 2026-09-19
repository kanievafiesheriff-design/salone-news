import { useEffect, useState } from "react";
import { getBreakingNews } from "../services/newsApi";

export default function BreakingNews() {
  const [text, setText] = useState("Latest breaking stories from Sierra Leone and around the world.");

  useEffect(() => {
    getBreakingNews()
      .then((response) => {
        if (response.text) setText(response.text);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-red-600 text-white overflow-hidden">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-2">
        <span className="shrink-0 text-xs font-bold uppercase z-10 bg-red-600 pr-2">
          Breaking News
        </span>

        <div className="relative flex-1 overflow-hidden">
          <p className="animate-marquee text-sm font-medium">
            {text}
          </p>
        </div>
      </div>
    </div>
  );
}
