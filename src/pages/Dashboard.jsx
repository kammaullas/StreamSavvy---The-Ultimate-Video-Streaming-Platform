import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserReviews, deleteReview, getReviewsByUserId } from "../services/reviews";
import tmdb, { imageUrl } from "../services/tmdb";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

export default function Dashboard() {
    const { user, updateUserProfile } = useAuth();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    // Edit Profile State
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");

    useEffect(() => {
        if (user) {
            fetchReviews();
            setEditName(user.name);
            setEditEmail(user.email);
        }
    }, [user]);

    const fetchReviews = async () => {
        try {
            // Fetch by User ID (stable) instead of Name (mutable)
            const res = await getReviewsByUserId(user.id);
            const userReviews = res.data;

            // Fetch movie details for each review
            const reviewsWithMovies = await Promise.all(
                userReviews.map(async (review) => {
                    try {
                        const movieRes = await tmdb.getDetails(review.movieId);
                        return { ...review, movie: movieRes.data };
                    } catch (error) {
                        console.error(`Failed to load movie ${review.movieId}`, error);
                        return { ...review, movie: null };
                    }
                })
            );

            setReviews(reviewsWithMovies);
        } catch (error) {
            console.error("Failed to fetch user reviews", error);
            toast.error("Failed to load reviews");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this review?")) {
            try {
                await deleteReview(id);
                setReviews((prev) => prev.filter((r) => r.id !== id));
                toast.success("Review deleted");
            } catch (error) {
                toast.error("Failed to delete review");
            }
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-[#0b0213] text-white flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please Login</h2>
                    <Link to="/login" className="text-purple-400 hover:underline">
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0b0213] text-white pt-24 px-6 md:px-10 pb-10">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-[#151518] p-8 rounded-2xl border border-gray-800 mb-10 flex flex-col md:flex-row items-center gap-6 shadow-xl">
                    <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        {isEditing ? (
                            <div className="flex flex-col gap-3 max-w-md">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="bg-black/50 border border-gray-700 p-2 rounded text-white"
                                    placeholder="Name"
                                />
                                <input
                                    type="email"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="bg-black/50 border border-gray-700 p-2 rounded text-white"
                                    placeholder="Email"
                                />
                                <div className="flex gap-2 mt-2">
                                    <button
                                        onClick={async () => {
                                            if (!editName || !editEmail) return toast.warn("Please fill all fields");
                                            const success = await updateUserProfile({ name: editName, email: editEmail });
                                            if (success) setIsEditing(false);
                                        }}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1 rounded text-sm transition"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditName(user.name);
                                            setEditEmail(user.email);
                                        }}
                                        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-1 rounded text-sm transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                                <p className="text-gray-400 mb-4">{user.email}</p>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-purple-400 hover:text-purple-300 text-sm underline"
                                >
                                    Edit Profile
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Reviews Section */}
                <h2 className="text-2xl font-bold mb-6 text-purple-200 border-l-4 border-purple-500 pl-4">
                    My Reviews
                </h2>

                {loading ? (
                    <p className="text-gray-400">Loading reviews...</p>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-10 bg-[#151518] rounded-xl border border-gray-800">
                        <p className="text-gray-400 mb-4">You haven't reviewed any movies yet.</p>
                        <Link
                            to="/movies"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition"
                        >
                            Browse Movies
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-[#151518] rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition duration-300 flex flex-col"
                            >
                                {review.movie && (
                                    <Link to={`/movie/${review.movieId}`} className="relative group">
                                        <img
                                            src={imageUrl(review.movie.backdrop_path || review.movie.poster_path)}
                                            alt={review.movie.title}
                                            className="w-full h-40 object-cover group-hover:opacity-80 transition"
                                        />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/40">
                                            <span className="text-white font-bold border border-white px-4 py-1 rounded-full backdrop-blur-sm">
                                                View Movie
                                            </span>
                                        </div>
                                    </Link>
                                )}

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-lg text-white truncate pr-2">
                                            {review.movie ? review.movie.title : "Unknown Movie"}
                                        </h3>
                                        <span className="text-yellow-400 font-bold text-sm flex-shrink-0">
                                            ★ {review.rating}/10
                                        </span>
                                    </div>

                                    <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-1">
                                        "{review.comment}"
                                    </p>

                                    <div className="flex justify-between items-center pt-4 border-t border-gray-800 mt-auto">
                                        <span className="text-xs text-gray-500">{review.date}</span>
                                        <button
                                            onClick={() => handleDelete(review.id)}
                                            className="text-red-500/70 hover:text-red-500 transition p-2 hover:bg-red-500/10 rounded-full"
                                            title="Delete Review"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
