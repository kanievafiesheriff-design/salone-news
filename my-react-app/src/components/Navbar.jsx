
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
      className="site-nav sticky top-0 z-40 hidden md:block"
    >
      <div className="site-nav__inner">
        <div className="site-nav__links">

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
                  className="site-nav__link group relative block whitespace-nowrap"
                >
                  {/* Text */}
                  <motion.span
                    animate={{
                      color: isActive ? "#d9573c" : "#34413c",
                    }}
                    whileHover={{
                      color: "#d9573c",
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {name}
                  </motion.span>

                  {/* Active / Hover underline */}
                  <motion.span
                    className="site-nav__underline absolute bottom-0"
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
                    className="absolute inset-0 -z-10 bg-[#f0f1eb]"
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
