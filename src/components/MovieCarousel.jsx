// src/components/MovieCarousel.jsx
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MovieCard from "./MovieCard";

export default function MovieCarousel({ title, movies }) {
  // Generate a unique ID for this specific row based on the title
  // e.g., "Trending Now" -> "trending-now"
  const rowId = title.replace(/\s+/g, '-').toLowerCase();

  const scroll = (direction) => {
    const slider = document.getElementById(rowId);
    if (slider) {
      const scrollAmount = direction === "left" ? -500 : 500;
      slider.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Prevent crash if movies is undefined
  if (!movies || movies.length === 0) return null;

  return (
    <div className="px-10 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-purple-200">{title}</h2>

      {/* Container for Relative Positioning */}
      <div className="relative group">
        
        {/* --- LEFT BUTTON (Hidden by default, shows on hover) --- */}
        <button
          onClick={() => scroll("left")}
          className="hidden group-hover:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-3 rounded-full hover:bg-black/80 transition-all duration-300 hover:scale-110"
        >
          <FaChevronLeft className="text-white" size={24} />
        </button>

        {/* --- MOVIE ROW --- */}
        <div
          id={rowId}
          className="flex gap-4 overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide pb-4"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* --- RIGHT BUTTON (Hidden by default, shows on hover) --- */}
        <button
          onClick={() => scroll("right")}
          className="hidden group-hover:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-3 rounded-full hover:bg-black/80 transition-all duration-300 hover:scale-110"
        >
          <FaChevronRight className="text-white" size={24} />
        </button>

      </div>
    </div>
  );
}