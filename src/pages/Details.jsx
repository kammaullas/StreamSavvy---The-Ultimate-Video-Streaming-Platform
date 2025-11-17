// src/pages/Details.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import tmdb, { imageUrl } from "../services/tmdb";
import {
  addToWatchlist,
  removeFromWatchlistRecordId,
  isInWatchlist
} from "../utils/watchlist";

import {
  getCachedMovie,
  saveMovieToCache
} from "../utils/cache";

import { FaArrowLeft, FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";

// Reusable card for similar movies
function SmallCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`}>
      <div className="w-36 cursor-pointer">
        <img
          src={imageUrl(movie.poster_path)}
          className="rounded-lg w-full h-48 object-cover"
          alt={movie.title}
        />
        <p className="text-sm mt-2 text-white truncate">{movie.title}</p>
      </div>
    </Link>
  );
}

export default function Details() {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [watchlistRecord, setWatchlistRecord] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [cast, setCast] = useState([]);
  const [trailerKey, setTrailerKey] = useState(null);

  useEffect(() => {
    loadMovie();
    isInWatchlist(id).then(setWatchlistRecord);
  }, [id]);

  const loadMovie = async () => {
    // FAST: Load from cache first
    const cached = await getCachedMovie(id);
    if (cached) {
      setMovie(cached);
      loadExtraData(id);
      return;
    }

    // Fetch from TMDB
    try {
      const res = await tmdb.getDetails(id);
      saveMovieToCache(res.data);
      setMovie(res.data);
      loadExtraData(id);
    } catch (error) {
      console.error("Failed to load movie details:", error);
    }
  };

  const loadExtraData = async (movieId) => {
    try {
      // Similar Movies
      const sm = await tmdb.getSimilar(movieId);
      setSimilar(sm.data.results);

      // Cast
      const credits = await tmdb.getCredits(movieId);
      setCast(credits.data.cast.slice(0, 12)); // top 12 cast

      // Trailer
      const vids = await tmdb.getVideos(movieId);
      const yt = vids.data.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      setTrailerKey(yt ? yt.key : null);
    } catch (e) {
      console.log("Error loading extra movie info", e);
    }
  };

  const toggleWatchlist = async () => {
    if (!movie) return;

    if (watchlistRecord) {
      await removeFromWatchlistRecordId(watchlistRecord.id);
      toast.info("Removed from Watchlist");
      setWatchlistRecord(null);
    } else {
      const res = await addToWatchlist(movie);
      if (res.status === "added") {
        toast.success("Added to Watchlist");
        const newRec = await isInWatchlist(movie.id);
        setWatchlistRecord(newRec);
      }
    }
  };

  if (!movie) return <p className="text-white p-10">Loading...</p>;

  const bg = imageUrl(movie.backdrop_path);
  const poster = imageUrl(movie.poster_path);
  const year = movie.release_date?.split("-")[0] || "—";

  return (
    <div className="text-white">
      {/* ---------------- BANNER ---------------- */}
      <div
        className="relative h-[60vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-black/60"></div>

        <Link
          to="/"
          className="absolute top-6 left-6 bg-black/60 px-4 py-2 rounded-lg text-white flex gap-2"
        >
          <FaArrowLeft /> Back
        </Link>
      </div>

      {/* ---------------- MAIN DETAILS ---------------- */}
      <div className="flex gap-10 px-10 py-10 -mt-32 relative">
        <img src={poster} className="w-64 rounded-xl shadow-royal" alt={movie.title} />

        <div className="flex-1">
          <h1 className="text-5xl font-bold mb-3">{movie.title}</h1>

          <p className="text-gray-300 mb-2">
            {year} • ⭐ {movie.vote_average?.toFixed(1)}
          </p>

          <p className="text-lg text-gray-300 max-w-2xl mb-6">{movie.overview}</p>

          <div className="flex gap-5">
            {/* Watch Now */}
            <button className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-xl font-medium">
              ▶ Watch Now
            </button>

            {/* Trailer */}
            {trailerKey && (
              <a
                href={`https://www.youtube.com/watch?v=${trailerKey}`}
                target="_blank"
                rel="noreferrer"
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-medium"
              >
                🎬 Trailer
              </a>
            )}

            {/* Heart Button */}
            <button
              onClick={toggleWatchlist}
              className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <FaHeart size={18} color={watchlistRecord ? "red" : "white"} />
              {watchlistRecord ? "Saved" : "Add to Watchlist"}
            </button>
          </div>
        </div>
      </div>

      {/* ---------------- CAST SECTION ---------------- */}
      <div className="px-10 mt-10">
        <h2 className="text-3xl font-bold mb-4">Cast</h2>
        <div className="flex gap-6 overflow-x-scroll scrollbar-hide pb-4">
          {cast.map((actor) => (
            <div key={actor.id} className="w-28 text-center">
              <img
                src={
                  actor.profile_path
                    ? imageUrl(actor.profile_path)
                    : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                }
                className="w-28 h-36 object-cover rounded-lg"
              />
              <p className="text-sm mt-2">{actor.name}</p>
              <p className="text-xs text-gray-400">{actor.character}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- SIMILAR MOVIES ---------------- */}
      <div className="px-10 mt-14 mb-10">
        <h2 className="text-3xl font-bold mb-4">Similar Movies</h2>

        <div className="flex gap-6 overflow-x-scroll pb-4 scrollbar-hide">
          {similar.map((m) => (
            <SmallCard key={m.id} movie={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
