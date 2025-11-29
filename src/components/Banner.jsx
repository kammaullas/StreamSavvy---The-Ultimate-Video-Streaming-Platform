import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import tmdb, { imageUrl } from "../services/tmdb";
import { FaPlay, FaInfoCircle } from "react-icons/fa";

export default function Banner({ movie }) {
  const [trailerKey, setTrailerKey] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const navigate = useNavigate();

  // Fetch Trailer when the movie data arrives
  useEffect(() => {
    if (movie) {
      const fetchTrailer = async () => {
        try {
          const res = await tmdb.getVideos(movie.id);
          const trailer = res.data.results.find(
            (vid) => vid.type === "Trailer" && vid.site === "YouTube"
          );
          if (trailer) setTrailerKey(trailer.key);
        } catch (error) {
          console.error("Error fetching trailer for banner:", error);
        }
      };
      fetchTrailer();
    }
  }, [movie]);

  if (!movie) {
    return (
      <div className="relative h-[70vh] w-full bg-[#1a1a1a] flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-600 animate-pulse">Loading...</h1>
      </div>
    );
  }

  return (
    <div
      className="relative -mt-1 h-[80vh] w-full bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to top, #0b0213, transparent 90%), 
                          linear-gradient(to right, #0b0213 0%, transparent 50%),
                          url(${imageUrl(movie.backdrop_path || movie.poster_path)})`
      }}
    >
      {/* Content */}
      <div className="absolute bottom-16 left-10 max-w-2xl p-4 z-20">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg">
          {movie.title}
        </h1>

        <p className="text-gray-200 text-lg md:text-xl line-clamp-3 mb-6 drop-shadow-md">
          {movie.overview}
        </p>

        <div className="flex gap-4">
          {/* PLAY BUTTON - Opens Modal */}
          <button 
            onClick={() => {
              if (trailerKey) {
                setShowTrailer(true);
              } else {
                alert("Sorry, no trailer available for this movie yet.");
              }
            }}
            className="bg-white text-black px-8 py-3 rounded hover:bg-gray-200 transition font-bold flex items-center gap-2"
          >
             <FaPlay /> Play
          </button>

          {/* MORE INFO BUTTON - Navigates to Details Page */}
          <button 
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="bg-gray-600/70 text-white px-8 py-3 rounded hover:bg-gray-600/50 transition font-bold backdrop-blur-sm flex items-center gap-2"
          >
             <FaInfoCircle /> More Info
          </button>
        </div>
      </div>

      {/* TRAILER MODAL (Overlay) */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/90 z-[999] flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:text-gray-400 transition z-50"
            onClick={() => setShowTrailer(false)}
          >
            &times;
          </button>

          {/* Video Player */}
          <div className="w-full max-w-5xl aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
              title="Movie Trailer"
              allow="autoplay; encrypted-media; fullscreen"
              className="rounded-xl shadow-2xl border border-gray-800"
            />
          </div>
        </div>
      )}
    </div>
  );
}