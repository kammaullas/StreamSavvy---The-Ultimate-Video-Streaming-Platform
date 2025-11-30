// src/pages/Movies.jsx
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import tmdb from "../services/tmdb";
import { FaFilter, FaCalendarAlt, FaStar, FaUndo, FaSearch } from "react-icons/fa";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);

  // Filter States
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    // Fetch genres on mount
    tmdb.getGenres().then((res) => setGenres(res.data.genres));
    fetchMovies();
  }, []);

  // Fetch movies when filters change
  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedYear, minRating]);

  const fetchMovies = () => {
    const params = {};
    if (selectedGenre) params.with_genres = selectedGenre;
    if (selectedYear) params.primary_release_year = selectedYear;
    if (minRating > 0) params.vote_average_gte = minRating;

    // If no filters, fetch popular (default)
    if (Object.keys(params).length === 0) {
      tmdb.getPopular().then((res) => setMovies(res.data.results));
    } else {
      tmdb.discover(params).then((res) => setMovies(res.data.results));
    }
  };

  // Client-side search filtering
  const filteredMovies = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  // Generate years for dropdown (last 30 years)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-[#0b0213] text-white px-6 py-10 pt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent mb-2">
              Browse Movies
            </h1>
            <p className="text-gray-400">Discover your next favorite film</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative group w-full md:w-64">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Search movies..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white pl-10 pr-4 py-3 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-500"
              />
            </div>

            {/* Filters Container */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-2 rounded-2xl shadow-xl flex flex-wrap gap-3 items-center">

              <div className="hidden md:flex items-center gap-2 text-purple-400 font-semibold px-2">
                <FaFilter />
              </div>

              {/* Genre Filter */}
              <div className="relative group flex-1 md:flex-none">
                <select
                  className="w-full appearance-none bg-black/40 text-white pl-4 pr-8 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer hover:bg-black/60 text-sm"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                >
                  <option value="">Genre</option>
                  {genres.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Year Filter */}
              <div className="relative group flex-1 md:flex-none">
                <select
                  className="w-full appearance-none bg-black/40 text-white pl-4 pr-8 py-2 rounded-xl border border-gray-700 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all cursor-pointer hover:bg-black/60 text-sm"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  <option value="">Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Rating Filter */}
              <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors">
                <FaStar className="text-yellow-500" size={12} />
                <span className="text-xs text-gray-300 font-medium w-14">{minRating}+</span>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
              </div>

              {/* Reset Button */}
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedGenre("");
                  setSelectedYear("");
                  setMinRating(0);
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                title="Reset Filters"
              >
                <FaUndo size={14} />
              </button>
            </div>
          </div>
        </div>

        {filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="bg-white/5 p-6 rounded-full mb-4">
              <FaFilter className="text-4xl text-gray-600" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No movies found</h3>
            <p className="text-gray-400 max-w-md">
              We couldn't find any movies matching your current filters. Try adjusting your criteria or resetting the filters.
            </p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedGenre("");
                setSelectedYear("");
                setMinRating(0);
              }}
              className="mt-6 px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
