import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

// Global Components
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import MobileNavbar from "./components/MobileNavbar";
import BreakingNews from "./components/BreakingNews";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import News from "./pages/News";
import Article from "./pages/Article";
import Category from "./pages/Category";
import Search from "./pages/Search";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Advertise from "./pages/Advertise";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AuthContext from "./context/AuthContext";

// 404
import NotFound from "./components/NotFound";

function PublicSite() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      <Header />

      <Navbar />

      <BreakingNews />

      <main>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Home />} />

          {/* News */}
          <Route path="/news" element={<News />} />

          {/* Single Article */}
          <Route path="/article/:id" element={<Article />} />

          {/* Categories */}
          <Route path="/category/:category" element={<Category />} />

          {/* Search */}
          <Route path="/search" element={<Search />} />

          {/* Static Pages */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/advertise" element={<Advertise />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />

      <MobileNavbar />
    </div>
  );
}

function App() {
  const { isAuthenticated, user } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={isAuthenticated ? <Navigate to="/admin" replace /> : <AdminLogin />} />
        <Route path="/admin" element={isAuthenticated && user.role === "admin" ? <AdminDashboard /> : <Navigate to="/admin/login" replace />} />
        <Route path="*" element={<PublicSite />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
