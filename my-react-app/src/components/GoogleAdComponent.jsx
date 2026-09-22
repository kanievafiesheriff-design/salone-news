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
    try {
      // This tells Google to find the <ins> tag and fill it with an ad
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      // AdSense can throw errors if slots are filled or if scripts are blocked
      console.error("AdSense error:", e);
    }
  }, []);

  return (
    <div className="my-6 flex justify-center overflow-hidden w-full">
      <ins className="adsbygoogle"
           style={{ display: 'block' }}
           data-ad-client="ca-pub-5265234750848502"
           data-ad-slot={slot}
           data-ad-format={format}
           data-full-width-responsive={responsive}>
      </ins>
    </div>
  );
};

export default GoogleAdComponent;
