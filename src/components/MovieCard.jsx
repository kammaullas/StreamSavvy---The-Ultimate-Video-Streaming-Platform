import { Link } from "react-router-dom";
import { imageUrl } from "../services/tmdb";
import { FaHeart } from "react-icons/fa";
import { addToWatchlist, removeFromWatchlistRecordId, isInWatchlist } from "../utils/watchlist";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

export default function MovieCard({ movie }) {
  const [saved, setSaved] = useState(false);
  const [recordId, setRecordId] = useState(null); // JSON-server internal ID
  const { user } = useAuth();

  // CHECK IF MOVIE ALREADY EXISTS IN WATCHLIST
  useEffect(() => {
    if (user && movie) {
      isInWatchlist(movie.id, user.id).then((record) => {
        if (record) {
          setSaved(true);
          setRecordId(record.id);
        } else {
          setSaved(false);
          setRecordId(null);
        }
      });
    } else {
      setSaved(false);
      setRecordId(null);
    }
  }, [movie.id, user]);

  // HANDLE HEART CLICK
  const handleHeartClick = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to add to watchlist");
      return;
    }

    if (!saved) {
      // ADD MOVIE
      const res = await addToWatchlist(movie, user.id);
      if (res.status === "added") {
        setSaved(true);
        // Re-check to get the new record ID
        const newRecord = await isInWatchlist(movie.id, user.id);
        if (newRecord) setRecordId(newRecord.id);
        toast.success("Added to Watchlist");
      } else if (res.status === "exists") {
        toast.info("Already in Watchlist");
      }
    } else {
      // REMOVE MOVIE
      if (recordId) {
        const res = await removeFromWatchlistRecordId(recordId);
        if (res.status === "removed") {
          setSaved(false);
          setRecordId(null);
          toast.warn("Removed from Watchlist");
        }
      }
    }
  };

  return (
    <Link to={`/movie/${movie.id}`}>
      <div className="relative group w-44 cursor-pointer">

        {/* HEART ICON */}
        <button
          onClick={handleHeartClick}
          className="absolute top-2 right-2 z-20 bg-black/60 p-2 rounded-full"
        >
          <FaHeart
            className={`text-sm transition ${saved ? "text-red-500" : "text-white group-hover:text-purple-300"
              }`}
          />
        </button>

        {/* POSTER */}
        <img
          src={imageUrl(movie.poster_path)}
          alt={movie.title}
          className="rounded-lg w-full h-64 object-cover shadow-royal 
                     group-hover:scale-105 transition duration-300"
        />
      </div>
    </Link>
  );
}
