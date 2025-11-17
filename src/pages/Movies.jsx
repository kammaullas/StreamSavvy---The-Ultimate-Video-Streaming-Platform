// src/pages/Movies.jsx
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import tmdb from "../services/tmdb";

export default function Movies() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    tmdb.getPopular().then((res) => setMovies(res.data.results));
  }, []);

  const filtered = movies.filter((m) =>
    m.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-6 py-10">
      <h1 className="text-4xl font-bold mb-5">Browse Movies</h1>

      <input
        className="px-4 py-2 bg-royal-850 rounded w-full mb-6"
        placeholder="Search movies..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {filtered.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}
