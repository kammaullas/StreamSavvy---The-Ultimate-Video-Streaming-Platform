// src/pages/Watchlist.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";
import { removeFromWatchlistRecordId } from "../utils/watchlist";

export default function Watchlist() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await api.get("/watchlist");
      setList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("LOAD ERROR:", err);
      toast.error("Failed to load watchlist");
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handler = () => load();
    window.addEventListener("watchlist-updated", handler);
    return () => window.removeEventListener("watchlist-updated", handler);
  }, []);

  const remove = async (recordId) => {
    const prev = [...list];
    setList(prev.filter((i) => i.id !== recordId));

    try {
      const res = await removeFromWatchlistRecordId(recordId);

      if (res.status === "removed") {
        toast.success("Removed");
      } else {
        setList(prev);
      }
    } catch (err) {
      console.error("DELETE ERROR:", err);
      toast.error("Could not remove item");
      setList(prev);
    }
  };

  // SAFE poster resolver
  const posterUrl = (item) => {
    const p = item.poster_path || item.poster || "";
    if (!p) return ""; // no poster
    if (p.startsWith("http")) return p;
    if (p.startsWith("/")) return `https://image.tmdb.org/t/p/w500${p}`;
    return "";
  };

  return (
    <div className="px-6 py-12">
      <h1 className="text-4xl font-bold mb-8">My List</h1>

      {loading && <p className="text-gray-400">Loading...</p>}
      {!loading && list.length === 0 && (
        <p className="text-gray-400">Nothing saved yet.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {list.map((item) => {
          const poster = posterUrl(item);
          const tmdbId = item.tmdb_id || item.movieId || item.id; // safe fallback

          return (
            <div
              key={item.id}
              className="bg-royal-950 rounded-xl overflow-hidden shadow-royal"
            >
              <Link to={`/movie/${tmdbId}`}>
                <img
                  src={poster}
                  alt={item.title}
                  className="h-64 w-full object-cover"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </Link>

              <div className="p-3">
                <h3 className="font-bold text-lg">{item.title}</h3>
                <button
                  onClick={() => remove(item.id)}
                  className="mt-3 btn-purple w-full py-2"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
