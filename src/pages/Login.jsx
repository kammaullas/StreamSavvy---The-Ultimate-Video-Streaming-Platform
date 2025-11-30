import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import popcornBg from "../assets/popcorn_bg.png";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await login(email, password);
        if (success) {
            navigate("/");
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background Image - Flipped horizontally */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${popcornBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: 'scaleX(-1)' // Flips the image so popcorn is on the left
                }}
            />

            {/* Overlay for better text readability if needed, though design asks for split */}
            <div className="absolute inset-0 bg-black/40 z-0" />

            {/* Content Container - Right Aligned */}
            <div className="relative z-10 flex items-center justify-end min-h-screen px-4 md:px-20">
                <div className="w-full max-w-md p-8 space-y-6 bg-black/80 backdrop-blur-sm border border-gray-700 rounded-2xl shadow-2xl">
                    <div className="text-center">
                        <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-gray-400">Login to continue your streaming journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full px-4 py-3 text-white bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full px-4 py-3 text-white bg-gray-900/50 border border-gray-600 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                                placeholder="Enter your password"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full px-4 py-3 font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-offset-2 focus:ring-offset-gray-900 transition transform hover:scale-[1.02]"
                        >
                            Login
                        </button>
                    </form>
                    <p className="text-sm text-center text-gray-400">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-purple-400 hover:text-purple-300 font-medium hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
