// src/utils/watchlist.js
import api from "../services/api";
import { toast } from "react-toastify";

/**
 * Add movie to watchlist
 * movie object must have:
 *  - id (TMDB id)
 *  - title
 *  - poster_path
 *  - vote_average
 */
export async function addToWatchlist(movie) {
  try {
    // Check for duplicates
    const existing = await api.get(`/watchlist?tmdb_id=${movie.id}`);
    if (existing.data.length > 0) {
      return { status: "exists" };
    }

    const payload = {
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
    };

    await api.post("/watchlist", payload);

    // notify other components
    window.dispatchEvent(new Event("watchlist-updated"));

    return { status: "added" };
  } catch (err) {
    console.error("Add error:", err);
    return { status: "error" };
  }
}

/**
 * Remove watchlist item by record ID (json-server ID)
 */
export async function removeFromWatchlistRecordId(recordId) {
  try {
    await api.delete(`/watchlist/${recordId}`);

    // notify other components
    window.dispatchEvent(new Event("watchlist-updated"));

    return { status: "removed" };
  } catch (err) {
    console.error("Remove error:", err);
    return { status: "error" };
  }
}

/**
 * Check if movie is already in watchlist
 */
export async function isInWatchlist(tmdbId) {
  try {
    const res = await api.get(`/watchlist?tmdb_id=${tmdbId}`);
    return res.data.length > 0 ? res.data[0] : null;
  } catch {
    return null;
  }
}
