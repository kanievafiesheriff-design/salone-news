import React, { useEffect } from 'react';

/**
 * GoogleAdComponent
 *
 * A reusable component to display Google AdSense ads.
 * It handles the manual 'push' required for SPAs where the
 * AdSense script only scans the DOM once on initial load.
 */
const GoogleAdComponent = ({ slot, format = 'auto', responsive = 'true' }) => {
  useEffect(() => {
    // Add a small delay to ensure the DOM has calculated the layout
    // and the container width is not 0.
    const timer = setTimeout(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Silently handle "All slots filled" errors, only log actual issues
        if (!e.message?.includes("All slots filled")) {
          console.error("AdSense error:", e);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="my-6 flex justify-center overflow-hidden w-full" style={{ minHeight: '100px', minWidth: '250px' }}>
      <ins className="adsbygoogle"
           style={{ display: 'block', width: '100%' }}
           data-ad-client="ca-pub-5265234750848502"
           data-ad-slot={slot}
           data-ad-format={format}
           data-full-width-responsive={responsive}>
      </ins>
    </div>
  );
};

export default GoogleAdComponent;
