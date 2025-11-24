// src/pages/Details.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import tmdb, { imageUrl } from "../services/tmdb";
import { getReviews, addReview, deleteReview } from "../services/reviews";

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

// Small movie card
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
  const [showTrailer, setShowTrailer] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    loadMovie();
    isInWatchlist(id).then(setWatchlistRecord);
    getReviews(id).then(res => setReviews(res.data));
  }, [id]);

  const loadMovie = async () => {
    const cached = await getCachedMovie(id);
    if (cached) {
      setMovie(cached);
      loadExtraData(id);
      return;
    }

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
      const sm = await tmdb.getSimilar(movieId);
      setSimilar(sm.data.results);

      const credits = await tmdb.getCredits(movieId);
      setCast(credits.data.cast.slice(0, 12));

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
    <div className="bg-[#0b0213] text-white">
      {/* ---------- BANNER ---------- */}
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

      {/* ---------- MAIN INFO ---------- */}
      
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

            {/* Trailer Button: OPENS MODAL */}
            {trailerKey && (
              <button
                onClick={() => setShowTrailer(true)}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-medium flex items-center gap-2"
              >
                🎬 Trailer
              </button>
            )}

            {/* Watchlist Button */}
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
      {/* ---------- CAST ---------- */}
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

      {/* ---------- SIMILAR MOVIES ---------- */}
      <div className="px-10 mt-14 mb-10">
        <h2 className="text-3xl font-bold mb-4">Similar Movies</h2>

        <div className="flex gap-6 overflow-x-scroll pb-4 scrollbar-hide">
          {similar.map((m) => (
            <SmallCard key={m.id} movie={m} />
          ))}
        </div>
      </div>
      {/* ---------------- REVIEWS SECTION ---------------- */}
<div className="px-10 mt-14 mb-10">
  <h2 className="text-3xl font-bold mb-6">Reviews & Ratings</h2>

  {/* Existing Reviews */}
  <div className="space-y-6 mb-10">
    {reviews.length === 0 && (
      <p className="text-gray-400">No reviews yet. Be the first!</p>
    )}

    {reviews.map(r => (
      <div key={r.id} className="bg-gray-800 p-4 rounded-xl shadow-lg">
        <p className="text-yellow-400 text-lg">⭐ {r.rating}/10</p>
        <p className="mt-1">{r.comment}</p>
        <p className="text-xs text-gray-500 mt-2">{r.date}</p>

        {/* Optional Delete Button */}
        <button
          onClick={() => {
            deleteReview(r.id).then(() =>
              setReviews(prev => prev.filter(x => x.id !== r.id))
            );
          }}
          className="text-red-500 text-xs mt-3"
        >
          Delete
        </button>
      </div>
    ))}
  </div>

  {/* Add New Review */}
  <div className="bg-gray-900 p-6 rounded-xl w-full max-w-2xl">
    <h3 className="text-xl font-semibold mb-3">Add Your Review</h3>

    {/* Star Selector */}
    <div className="flex gap-2 mb-3">
      {[...Array(10)].map((_, i) => (
        <span
          key={i}
          onClick={() => setNewRating(i + 1)}
          className={`cursor-pointer text-2xl ${
            i < newRating ? "text-yellow-400" : "text-gray-600"
          }`}
        >
          ★
        </span>
      ))}
    </div>

    <textarea
      className="w-full bg-gray-700 p-3 rounded-md"
      placeholder="Write your thoughts..."
      value={newComment}
      onChange={(e) => setNewComment(e.target.value)}
    />

    <button
      className="bg-purple-600 px-4 py-2 rounded-md mt-4"
      onClick={async () => {
        if (!newRating || !newComment) return alert("Enter rating & review!");

        const review = {
          movieId: Number(id),
          rating: newRating,
          comment: newComment,
          user: "Guest",
          date: new Date().toISOString().split("T")[0]
        };

        const res = await addReview(review);
        setReviews(prev => [...prev, res.data]);
        setNewComment("");
        setNewRating(0);
      }}
    >
      Submit Review
    </button>
  </div>
</div>

      {/* ---------- TRAILER MODAL ---------- */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[999]">
          <button
            className="absolute top-10 right-10 text-white text-3xl"
            onClick={() => setShowTrailer(false)}
          >
            ✕
          </button>

          <iframe
            width="80%"
            height="70%"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            webkitallowfullscreen="true"
            mozallowfullscreen="true"
            className="rounded-xl shadow-royal"
          />

        </div>
      )}
    </div>
  );
}
