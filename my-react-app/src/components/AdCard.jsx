import React, { useEffect, useRef } from 'react';
import { ExternalLink } from 'lucide-react';

export default function AdCard({ id, image, title, description, link, size = 'default' }) {
  const defaultImage = "https://via.placeholder.com/400x250?text=Promoted+Content";
  const adImage = image || defaultImage;
  const cardRef = useRef(null);

  // Track impressions using IntersectionObserver
  useEffect(() => {
    if (!id) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackEvent('impression');
            observer.unobserve(entry.target); // Only track once per mount
          }
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [id]);

  const trackEvent = async (type) => {
    try {
      await fetch(`http://localhost:5000/api/ads/track/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
    } catch (error) {
      console.error(`Failed to track ${type}:`, error);
    }
  };

  const handleLinkClick = (e) => {
    if (!id) return;
    e.preventDefault();

    // Fire and forget tracking
    trackEvent('click');

    // Open link in new tab
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  // Layout styles mapping
  const layoutClasses = {
    default: 'p-0',
    compact: 'flex gap-4 p-3',
    banner: 'flex items-center justify-between p-3 h-24',
    skyscraper: 'flex flex-col items-center p-4 w-40 h-96 text-center',
  };

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-lg ${layoutClasses[size] || layoutClasses.default}`}
    >
      {/* Sponsored Badge */}
      <div className="absolute top-3 left-3 z-10">
        <span className="rounded-full bg-gray-900/80 px-2 py-1 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
          Sponsored
        </span>
      </div>

      {size === 'compact' && (
        <>
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg">
            <img src={adImage} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
          </div>
          <div className="flex flex-col justify-center">
            <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{title}</h4>
            <p className="text-xs text-gray-500 line-clamp-2">{description}</p>
            <a
              href={link}
              onClick={handleLinkClick}
              className="mt-1 text-xs font-semibold text-green-700 hover:underline flex items-center gap-1"
            >
              Learn more <ExternalLink size={10} />
            </a>
          </div>
        </>
      )}

      {size === 'banner' && (
        <>
          <div className="flex items-center gap-6 w-full">
            <img src={adImage} alt={title} className="h-16 w-32 object-cover rounded-lg" />
            <div className="flex-1">
              <h4 className="text-md font-bold text-gray-900 line-clamp-1">{title}</h4>
              <p className="text-xs text-gray-500 line-clamp-1">{description}</p>
            </div>
            <a
              href={link}
              onClick={handleLinkClick}
              className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-green-700 hover:text-white"
            >
              Visit Site <ExternalLink size={12} />
            </a>
          </div>
        </>
      )}

      {size === 'skyscraper' && (
        <>
          <div className="relative h-48 w-full overflow-hidden rounded-lg">
            <img src={adImage} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          </div>
          <div className="p-4 flex flex-col items-center">
            <h3 className="text-sm font-bold text-gray-900 text-center line-clamp-2">{title}</h3>
            <p className="mt-2 text-xs text-gray-600 text-center line-clamp-4">{description}</p>
            <a
              href={link}
              onClick={handleLinkClick}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-green-700 hover:text-white"
            >
              Visit Site <ExternalLink size={12} />
            </a>
          </div>
        </>
      )}

      {size !== 'compact' && size !== 'banner' && size !== 'skyscraper' && (
        <>
          <div className="relative h-48 overflow-hidden">
            <img src={adImage} alt={title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          </div>
          <div className="p-5">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-700 transition-colors">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 line-clamp-3">
              {description}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <a
                href={link}
                onClick={handleLinkClick}
                className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-700 transition hover:bg-green-700 hover:text-white"
              >
                Visit Site <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
