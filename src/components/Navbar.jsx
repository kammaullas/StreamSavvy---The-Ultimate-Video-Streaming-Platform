import { Link } from "react-router-dom";
import { FaSearch, FaUser } from "react-icons/fa";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full h-20 z-50 
      bg-gradient-to-b from-black via-black/80 to-transparent 
      flex items-center justify-between px-10">

      <h1 className="text-3xl font-bold text-purple-400">StreamSavvy</h1>

      <div className="flex gap-10 text-lg">
        <Link to="/" className="hover:text-purple-300">Home</Link>
        <Link to="/movies" className="hover:text-purple-300">Browse</Link>
        <Link to="/watchlist" className="hover:text-purple-300">My List</Link>
      </div>

      <div className="flex items-center gap-6">
        <FaSearch size={22} className="hover:text-purple-300" />
        <FaUser size={22} className="hover:text-purple-300" />
      </div>
    </nav>
  );
}
