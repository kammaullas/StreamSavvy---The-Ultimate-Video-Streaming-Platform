import axios from "axios";

const BASE = import.meta.env.VITE_TMDB_BASE;
const KEY = import.meta.env.VITE_TMDB_KEY;

export const imageUrl = (path) =>
  `https://image.tmdb.org/t/p/original${path}`;

const tmdb = {
  // ---------------- HOME SECTIONS ----------------
  getTrending: () =>
    axios.get(`${BASE}/trending/movie/week?api_key=${KEY}&language=en-US`),

  getPopular: () =>
    axios.get(`${BASE}/movie/popular?api_key=${KEY}&language=en-US&page=1`),

  getTopRated: () =>
    axios.get(`${BASE}/movie/top_rated?api_key=${KEY}&language=en-US&page=1`),

  // ---------------- DETAILS PAGE ----------------
  getDetails: (id) =>
    axios.get(`${BASE}/movie/${id}?api_key=${KEY}&language=en-US`),

  getCredits: (id) =>
    axios.get(`${BASE}/movie/${id}/credits?api_key=${KEY}&language=en-US`),

  getSimilar: (id) =>
    axios.get(`${BASE}/movie/${id}/similar?api_key=${KEY}&language=en-US`),

  getVideos: (id) =>
    axios.get(`${BASE}/movie/${id}/videos?api_key=${KEY}&language=en-US`),

  // ---------------- DISCOVER / FILTERS ----------------
  getGenres: () =>
    axios.get(`${BASE}/genre/movie/list?api_key=${KEY}&language=en-US`),

  discover: (params) => {
    let query = `${BASE}/discover/movie?api_key=${KEY}&language=en-US&sort_by=popularity.desc`;
    if (params.with_genres) query += `&with_genres=${params.with_genres}`;
    if (params.primary_release_year) query += `&primary_release_year=${params.primary_release_year}`;
    if (params.vote_average_gte) query += `&vote_average.gte=${params.vote_average_gte}`;
    return axios.get(query);
  }
};

export default tmdb;
