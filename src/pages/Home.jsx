import { useEffect, useState } from "react";
import tmdb, { imageUrl } from "../services/tmdb";
import MovieCarousel from "../components/MovieCarousel";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);

  useEffect(() => {
    tmdb.getTrending()
      .then(res => setTrending(res.data.results || []))
      .catch(console.error);

    tmdb.getPopular()
      .then(res => setPopular(res.data.results || []))
      .catch(console.error);

    tmdb.getTopRated()
      .then(res => setTopRated(res.data.results || []))
      .catch(console.error);
  }, []);

  const bannerMovie = popular.length > 0 ? popular[0] : null;

  return (
    <div className="pt-20">

      {/* ------------------ BANNER ------------------ */}
      {bannerMovie && (
        <div
          className="relative h-[70vh] w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl(bannerMovie.backdrop_path)})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

          <div className="absolute bottom-20 left-10">
            <h1 className="text-5xl font-bold">
              {bannerMovie.title}
            </h1>

            <p className="mt-3 max-w-xl text-gray-300">
              {bannerMovie.overview}
            </p>

            <div className="flex gap-4 mt-5">
              <button className="bg-white text-black px-6 py-2 rounded-md hover:bg-gray-200">
                ▶ Play
              </button>
              <button className="bg-white/30 text-white px-6 py-2 rounded-md hover:bg-white/40">
                ℹ More Info
              </button>
            </div>
          </div>
          <button
  onClick={() =>
    addToWatchlist(popular[0])
      .then(r => alert(r.status === "added" ? "Added!" : "Already added"))
  }
  className="bg-white text-black px-6 py-2 rounded-md hover:bg-gray-200"
>
  ➕ My List
</button>

        </div>
      )}

      {/* ------------------ CAROUSELS ------------------ */}
      <MovieCarousel title="Trending Now" movies={trending} />
      <MovieCarousel title="Popular on StreamSavvy" movies={popular} />
      <MovieCarousel title="Top Rated" movies={topRated} />

    </div>
  );
}
