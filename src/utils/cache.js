import api from "../services/api";

// Get movie details from local cache
export const getCachedMovie = async (id) => {
  try {
    const res = await api.get(`/movie_cache?id=${id}`);
    return res.data.length ? res.data[0] : null;
  } catch (err) {
    console.error("Cache fetch failed:", err);
    return null;
  }
};

// Store full movie details in cache
export const saveMovieToCache = async (movie) => {
  try {
    await api.post("/movie_cache", movie);
  } catch (err) {
    console.error("Cache save failed:", err);
  }
};
