import { useEffect, useState } from "react";
import FeaturedNews from "../components/FeaturedNews";
import LatestNews from "../components/LatestNews";
import TrendingNews from "../components/TrendingNews";
import PopularNews from "../components/PopularNews";
import CategoryNews from "../components/CategoryNews";
import AdCard from "../components/AdCard";
import { getAds } from "../services/newsApi";

export default function Home() {
  const [ads, setAds] = useState({
    home_top: [],
    home_sidebar: [],
  });

  useEffect(() => {
    // Fetch ads for different slots
    Promise.all([
      getAds('home_top').then(res => ({ slot: 'home_top', data: res.data || [] })),
      getAds('home_sidebar').then(res => ({ slot: 'home_sidebar', data: res.data || [] })),
    ]).then(results => {
      const adMap = {};
      results.forEach(res => {
        adMap[res.slot] = res.data;
      });
      setAds(adMap);
    }).catch(err => console.error("Error fetching ads:", err));
  }, []);

  return (
    <main>
      {/* Main featured stories */}
      <FeaturedNews />

      {/* Home Top Ad Slot */}
      {ads.home_top?.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 py-8">
          {ads.home_top.map((ad) => (
            <AdCard
              key={ad._id}
              id={ad._id}
              image={ad.imageUrl}
              title={ad.title}
              description={ad.clientName}
              link={ad.externalLink}
              size={ad.adSize}
            />
          ))}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-9">
          {/* Latest news */}
          <LatestNews />

          {/* Politics */}
          <CategoryNews
            category="Politics"
            title="Politics News"
          />

          {/* Business */}
          <CategoryNews
            category="Business"
            title="Business News"
          />

          {/* Sports */}
          <CategoryNews
            category="Sports"
            title="Sports News"
          />

          {/* Technology */}
          <CategoryNews
            category="Technology"
            title="Technology News"
          />

          {/* Health */}
          <CategoryNews
            category="Health"
            title="Health News"
          />

          {/* Education */}
          <CategoryNews
            category="Education"
            title="Education News"
          />

          {/* Entertainment */}
          <CategoryNews
            category="Entertainment"
            title="Entertainment News"
          />

          {/* Africa */}
          <CategoryNews
            category="Africa"
            title="Africa News"
          />

          {/* Lifestyle */}
          <CategoryNews
            category="Lifestyle"
            title="Lifestyle News"
          />
        </div>

        <aside className="lg:col-span-3 space-y-8">
          {/* Home Sidebar Ad Slot */}
          {ads.home_sidebar?.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 px-2">Sponsored</h3>
              {ads.home_sidebar.map((ad) => (
                <AdCard
                  key={ad._id}
                  id={ad._id}
                  image={ad.imageUrl}
                  title={ad.title}
                  description={ad.clientName}
                  link={ad.externalLink}
                  size={ad.adSize}
                />
              ))}
            </div>
          )}

          {/* Trending */}
          <TrendingNews />

          {/* Most popular */}
          <PopularNews />
        </aside>
      </div>
    </main>
  );
}
