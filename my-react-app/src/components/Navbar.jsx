
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const categories = [
    ["Home", "/"],
    ["News", "/news"],
    ["Politics", "/category/politics"],
    ["Business", "/category/business"],
    ["Sports", "/category/sports"],
    ["Entertainment", "/category/entertainment"],
    ["Health", "/category/health"],
    ["Technology", "/category/technology"],
    ["Education", "/category/education"],
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
      }}
      className="sticky top-0 z-40 hidden border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur-md md:block"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">

          {categories.map(([name, path], index) => {
            const isActive =
              location.pathname === path ||
              (path !== "/" && location.pathname.startsWith(path));

            return (
              <motion.div
                key={path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.05,
                }}
              >
                <Link
                  to={path}
                  className="group relative block whitespace-nowrap px-4 py-4 text-sm font-semibold"
                >
                  {/* Text */}
                  <motion.span
                    animate={{
                      color: isActive ? "#15803d" : "#374151",
                    }}
                    whileHover={{
                      color: "#15803d",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {name}
                  </motion.span>

                  {/* Active / Hover underline */}
                  <motion.span
                    className="absolute bottom-0 left-3 right-3 h-[3px] rounded-full bg-green-700"
                    initial={false}
                    animate={{
                      scaleX: isActive ? 1 : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    whileHover={{
                      scaleX: 1,
                      opacity: 1,
                    }}
                    transition={{
                      duration: 0.25,
                      ease: "easeOut",
                    }}
                  />

                  {/* Hover background */}
                  <motion.span
                    className="absolute inset-1 -z-10 rounded-lg bg-green-50"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileHover={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            );
          })}

        </div>
      </div>
    </motion.nav>
  );
}
