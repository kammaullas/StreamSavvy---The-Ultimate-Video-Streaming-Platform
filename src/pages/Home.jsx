import { useEffect, useState } from "react";
import tmdb from "../services/tmdb"; // Removed imageUrl import as it's handled in Banner
import MovieCarousel from "../components/MovieCarousel";
import Banner from "../components/Banner"; // Import your Banner component

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

  // Get the first movie for the banner
  const bannerMovie = popular.length > 0 ? popular[0] : null;

  return (
    // FIX: Removed 'pt-20'. Added 'min-h-screen'
    <div className="bg-[#0b0213] min-h-screen text-white">
      
      {/* ------------------ BANNER ------------------ */}
      {/* Passing the data to your Banner component */}
      <Banner movie={bannerMovie} />

      {/* ------------------ CAROUSELS ------------------ */}
      {/* Added 'pb-10' for spacing at the bottom of the page */}
      <div className="pb-10 space-y-8">
        <MovieCarousel title="Trending Now" movies={trending} />
        <MovieCarousel title="Popular on StreamSavvy" movies={popular} />
        <MovieCarousel title="Top Rated" movies={topRated} />
      </div>

    </div>
  );
}