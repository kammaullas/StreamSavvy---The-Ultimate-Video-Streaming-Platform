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
 * userId: ID of the logged-in user
 */
export async function addToWatchlist(movie, userId) {
  if (!userId) {
    console.error("addToWatchlist: No userId provided");
    return { status: "error", message: "User not logged in" };
  }

  try {
    // Check for duplicates for this specific user
    const existing = await api.get(`/watchlist?tmdb_id=${movie.id}&userId=${userId}`);
    if (existing.data.length > 0) {
      return { status: "exists" };
    }

    const payload = {
      tmdb_id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
      userId: userId, // Associate with user
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
 * Check if movie is already in watchlist for a specific user
 */
export async function isInWatchlist(tmdbId, userId) {
  if (!userId) return null;

  try {
    const res = await api.get(`/watchlist?tmdb_id=${tmdbId}&userId=${userId}`);
    return res.data.length > 0 ? res.data[0] : null;
  } catch {
    return null;
  }
}
