import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Details from "./pages/Details";
import Watchlist from "./pages/Watchlist";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div className="text-white">
      <Navbar />

      {/* Prevent overlap */}
      <div className="pt-24"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/movie/:id" element={<Details />} />
          <Route path="/watchlist" element={<Watchlist />} />
        </Routes>
      </div>

      <ToastContainer theme="dark" />
    </div>
  );
}
