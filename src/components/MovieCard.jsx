import { Link } from "react-router-dom";
import { imageUrl } from "../services/tmdb";
import { FaHeart } from "react-icons/fa";
import api from "../services/api";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function MovieCard({ movie }) {
  const [saved, setSaved] = useState(false);
  const [recordId, setRecordId] = useState(null); // JSON-server internal ID

  // CHECK IF MOVIE ALREADY EXISTS IN WATCHLIST
  useEffect(() => {
    api.get(`/watchlist?tmdb_id=${movie.id}`)
      .then(res => {
        if (res.data.length > 0) {
          setSaved(true);
          setRecordId(res.data[0].id); // JSON-server internal id
        }
      })
      .catch(err => console.log(err));
  }, [movie.id]);

  // HANDLE HEART CLICK
  const handleHeartClick = async (e) => {
    e.preventDefault();

    if (!saved) {
      // ADD MOVIE
      const res = await api.post("/watchlist", {
        tmdb_id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average
      });

      setSaved(true);
      setRecordId(res.data.id); // store internal ID
      toast.success("✔ Added to Watchlist");

    } else {
      // REMOVE MOVIE
      if (recordId) {
        await api.delete(`/watchlist/${recordId}`);
        setSaved(false);
        setRecordId(null);
        toast.warn("❌ Removed from Watchlist");
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
            className={`text-sm transition ${
              saved ? "text-red-500" : "text-white group-hover:text-purple-300"
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
