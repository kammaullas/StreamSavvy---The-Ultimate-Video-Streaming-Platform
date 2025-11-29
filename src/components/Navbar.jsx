import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaSearch, FaUser, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Handle scroll logic
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Helper for active link styling
  const isActive = (path) =>
    location.pathname === path
      ? "text-purple-400 font-bold border-b-2 border-purple-400 pb-1"
      : "text-gray-300 hover:text-white font-medium transition-colors pb-1";

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-20 z-50 px-10 flex items-center justify-between transition-colors duration-300 ${isScrolled
        ? "bg-black shadow-lg" // Scrolled: Pure Black
        : "bg-[#18181b]"       // Initial: Solid Elegant Charcoal (Zinc-900)
        }`}
    >
      {/* --- LEFT: Logo --- */}
      {/* Width set to ensure the center section stays perfectly centered */}
      <div className="w-[250px] flex-shrink-0">
        <Link to="/">
          <h1 className="text-3xl font-bold tracking-wider text-purple-500 hover:text-purple-400 transition-colors">
            StreamSavvy
          </h1>
        </Link>
      </div>

      {/* --- CENTER: Navigation Links (Equidistant) --- */}
      <div className="hidden md:flex flex-1 justify-center items-center gap-14 text-lg">
        <Link to="/" className={isActive("/")}>
          Home
        </Link>
        <Link to="/movies" className={isActive("/movies")}>
          Browse
        </Link>
        <Link to="/watchlist" className={isActive("/watchlist")}>
          Watch List
        </Link>
      </div>

      {/* --- RIGHT: Icons --- */}
      {/* Width matches Logo container to maintain balance */}
      <div className="w-[250px] flex justify-end items-center gap-6">
        {/* Search Icon (Links to Browse as requested) */}
        <Link
          to="/movies"
          className="text-gray-300 hover:text-white hover:scale-110 transition-transform"
          aria-label="Search"
        >
          <FaSearch size={20} />
        </Link>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-purple-400">
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-gray-300 hover:text-red-500 hover:scale-110 transition-transform"
              aria-label="Logout"
              title="Logout"
            >
              <FaSignOutAlt size={20} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className={`px-4 py-1 text-sm font-medium transition-colors rounded ${location.pathname === "/register"
                  ? "text-purple-400 border border-purple-400 hover:bg-purple-400 hover:text-white"
                  : "text-white bg-purple-600 hover:bg-purple-700"
                }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`px-4 py-1 text-sm font-medium transition-colors rounded ${location.pathname === "/register"
                  ? "text-white bg-purple-600 hover:bg-purple-700"
                  : "text-purple-400 border border-purple-400 hover:bg-purple-400 hover:text-white"
                }`}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
