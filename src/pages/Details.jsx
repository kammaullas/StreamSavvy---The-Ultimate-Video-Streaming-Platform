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
import { getCachedMovie, saveMovieToCache } from "../utils/cache";
// ADDED: Chevron Icons
import { FaArrowLeft, FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

// Small movie card component
function SmallCard({ movie }) {
  return (
    <Link to={`/movie/${movie.id}`}>
      <div className="w-36 cursor-pointer hover:scale-105 transition duration-300">
        <img
          src={imageUrl(movie.poster_path)}
          className="rounded-lg w-full h-48 object-cover shadow-md"
          alt={movie.title}
        />
        <p className="text-sm mt-2 text-white truncate">{movie.title}</p>
      </div>
    </Link>
  );
}

export default function Details() {
  const { id } = useParams();
  const { user } = useAuth();

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
    if (!user) {
      toast.error("Please login to add to watchlist");
      return;
    }
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

  // --- NEW: Helper function to handle scrolling ---
  const scroll = (id, direction) => {
    const container = document.getElementById(id);
    if (container) {
      const scrollAmount = direction === "left" ? -500 : 500;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!movie) return <div className="min-h-screen bg-[#0b0213] text-white p-10">Loading...</div>;

  const bg = imageUrl(movie.backdrop_path);
  const poster = imageUrl(movie.poster_path);
  const year = movie.release_date?.split("-")[0] || "—";

  return (
    <div className="bg-[#0b0213] min-h-screen text-white">

      {/* ---------- BANNER ---------- */}
      <div
        className="relative h-[55vh] w-full bg-cover bg-top"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0b0213] to-transparent"></div>
        <Link
          to="/"
          className="absolute top-6 left-6 bg-black/50 hover:bg-purple-600 transition px-4 py-2 rounded-lg text-white flex items-center gap-2 backdrop-blur-sm"
        >
          <FaArrowLeft /> Back
        </Link>
      </div>

      {/* ---------- MAIN INFO ---------- */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-6 pb-10 flex flex-col md:flex-row gap-10">

        <div className="flex-shrink-0 mx-auto md:mx-0">
          <img
            src={poster}
            className="w-72 rounded-xl shadow-[0_0_20px_rgba(120,60,200,0.3)] border border-gray-800"
            alt={movie.title}
          />
        </div>

        <div className="flex-1 mt-2">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-purple-50 tracking-wide">
            {movie.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-300 mb-6 text-sm md:text-base font-medium">
            <span className="bg-gray-800 px-3 py-1 rounded text-white">{year}</span>
            <span>⭐ {movie.vote_average?.toFixed(1)} Rating</span>
            <span>• {movie.runtime ? `${movie.runtime} min` : "N/A"}</span>
          </div>

          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mb-8">
            {movie.overview}
          </p>

          <div className="flex flex-wrap gap-4">
            <button className="bg-purple-600 hover:bg-purple-700 transition px-8 py-3 rounded-lg font-bold shadow-lg shadow-purple-900/40">
              ▶ Watch Now
            </button>

            {trailerKey && (
              <button
                onClick={() => setShowTrailer(true)}
                className="bg-gray-800 hover:bg-gray-700 transition px-6 py-3 rounded-lg font-medium border border-gray-600"
              >
                🎬 Trailer
              </button>
            )}

            <button
              onClick={toggleWatchlist}
              className={`px-6 py-3 rounded-lg font-medium border transition flex items-center gap-2 ${watchlistRecord
                  ? "bg-gray-800 border-red-500 text-red-500 hover:bg-gray-700"
                  : "bg-gray-800 border-gray-600 hover:bg-gray-700 text-white"
                }`}
            >
              <FaHeart size={18} />
              {watchlistRecord ? "Saved" : "My List"}
            </button>
          </div>
        </div>
      </div>

      {/* ---------- CAST (With Scroll Buttons) ---------- */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-8 border-t border-gray-800 pt-8">
        <h2 className="text-2xl font-bold mb-6 text-purple-200">Top Cast</h2>

        {/* Relative container for positioning arrows */}
        <div className="relative group">

          {/* Left Arrow */}
          <button
            onClick={() => scroll("cast-slider", "left")}
            className="hidden group-hover:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-3 rounded-full hover:bg-black/80 transition"
          >
            <FaChevronLeft />
          </button>

          {/* Scroll Container */}
          <div id="cast-slider" className="flex gap-4 overflow-x-scroll scrollbar-hide pb-4 scroll-smooth">
            {cast.length > 0 ? cast.map((actor) => (
              <div key={actor.id} className="min-w-[100px] max-w-[100px] text-center">
                <img
                  src={
                    actor.profile_path
                      ? imageUrl(actor.profile_path)
                      : "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
                  }
                  className="w-24 h-24 object-cover rounded-full mx-auto mb-2 border-2 border-gray-700"
                  alt={actor.name}
                />
                <p className="text-sm font-medium truncate">{actor.name}</p>
                <p className="text-xs text-gray-400 truncate">{actor.character}</p>
              </div>
            )) : <p className="text-gray-500">No cast information available.</p>}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("cast-slider", "right")}
            className="hidden group-hover:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-3 rounded-full hover:bg-black/80 transition"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* ---------- SIMILAR MOVIES (With Scroll Buttons) ---------- */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-12 mb-10">
        <h2 className="text-2xl font-bold mb-6 text-purple-200">You Might Also Like</h2>

        {/* Relative container for positioning arrows */}
        <div className="relative group">

          {/* Left Arrow */}
          <button
            onClick={() => scroll("similar-slider", "left")}
            className="hidden group-hover:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-3 rounded-full hover:bg-black/80 transition"
          >
            <FaChevronLeft />
          </button>

          {/* Scroll Container */}
          <div id="similar-slider" className="flex gap-4 overflow-x-scroll pb-4 scrollbar-hide scroll-smooth">
            {similar.length > 0 ? similar.map((m) => (
              <SmallCard key={m.id} movie={m} />
            )) : <p className="text-gray-500">No similar movies found.</p>}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("similar-slider", "right")}
            className="hidden group-hover:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 p-3 rounded-full hover:bg-black/80 transition"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* ---------- REVIEWS SECTION ---------- */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-12 mb-20 border-t border-gray-800 pt-10">
        <h2 className="text-2xl font-bold mb-6 text-purple-200">User Reviews</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Review Form */}
          <div className="bg-[#151518] p-6 rounded-xl border border-gray-800 h-fit">
            {user ? (
              <>
                <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
                <div className="flex gap-2 mb-4">
                  {[...Array(10)].map((_, i) => (
                    <span
                      key={i}
                      onClick={() => setNewRating(i + 1)}
                      className={`cursor-pointer text-xl transition ${i < newRating ? "text-yellow-400 scale-110" : "text-gray-600 hover:text-gray-400"
                        }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <textarea
                  className="w-full bg-black/50 border border-gray-700 p-3 rounded-lg text-white focus:outline-none focus:border-purple-500 transition"
                  placeholder="What did you think of this movie?"
                  rows="4"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className="bg-white text-black font-bold px-6 py-2 rounded-lg mt-4 hover:bg-gray-200 transition w-full"
                  onClick={async () => {
                    if (!newRating || !newComment) return toast.warn("Please enter a rating and comment!");
                    const review = {
                      movieId: Number(id),
                      rating: newRating,
                      comment: newComment,
                      user: user.name,
                      date: new Date().toISOString().split("T")[0]
                    };
                    const res = await addReview(review);
                    setReviews(prev => [...prev, res.data]);
                    setNewComment("");
                    setNewRating(0);
                    toast.success("Review Submitted!");
                  }}
                >
                  Submit
                </button>
              </>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-400 mb-4">Please login to leave a review.</p>
                <Link to="/login" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition">
                  Login
                </Link>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700">
            {reviews.length === 0 && (
              <div className="text-gray-500 italic">No reviews yet. Be the first to review!</div>
            )}
            {reviews.map(r => (
              <div key={r.id} className="bg-[#1a1a1d] p-4 rounded-xl border border-gray-800/50">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-gray-300">User</span>
                    <span className="text-xs text-gray-500 ml-2">{r.date}</span>
                  </div>
                  <span className="text-yellow-400 font-bold text-sm">★ {r.rating}/10</span>
                </div>
                <p className="mt-2 text-gray-300 text-sm leading-relaxed">{r.comment}</p>
                <button
                  onClick={() => {
                    deleteReview(r.id).then(() =>
                      setReviews(prev => prev.filter(x => x.id !== r.id))
                    );
                    toast.info("Review deleted");
                  }}
                  className="text-red-500/50 hover:text-red-500 text-xs mt-3 transition"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------- TRAILER MODAL ---------- */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[999]">
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-300 transition"
            onClick={() => setShowTrailer(false)}
          >
            &times;
          </button>
          <div className="w-full max-w-5xl aspect-video px-4">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              allow="autoplay; encrypted-media; fullscreen"
              className="rounded-xl shadow-2xl border border-gray-800"
            />
          </div>
        </div>
      )}
    </div>
  );
}