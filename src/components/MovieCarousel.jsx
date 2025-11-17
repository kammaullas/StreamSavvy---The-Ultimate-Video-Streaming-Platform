import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import MovieCard from "./MovieCard";

export default function MovieCarousel({ title, movies }) {
  // Prevent crashes
  const safeMovies = Array.isArray(movies) ? movies : [];

  const scrollLeft = () => {
    document.getElementById(title)?.scrollBy({ left: -500, behavior: "smooth" });
  };

  const scrollRight = () => {
    document.getElementById(title)?.scrollBy({ left: 500, behavior: "smooth" });
  };

  return (
    <div className="mt-10 px-6">
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>

      <div className="relative">
        {/* Left Arrow */}
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full z-20"
          onClick={scrollLeft}
        >
          <FaChevronLeft />
        </button>

        {/* Movie List */}
        <div
          id={title}
          className="flex gap-4 overflow-x-scroll scrollbar-hide scroll-smooth"
        >
          {safeMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 p-3 rounded-full z-20"
          onClick={scrollRight}
        >
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
}
