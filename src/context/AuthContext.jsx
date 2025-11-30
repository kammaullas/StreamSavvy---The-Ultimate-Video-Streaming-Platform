import { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser, checkEmailExists, updateUser } from "../services/auth";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const users = await loginUser({ email, password });
            if (users.length > 0) {
                const loggedInUser = users[0];
                setUser(loggedInUser);
                localStorage.setItem("user", JSON.stringify(loggedInUser));
                toast.success(`Welcome back, ${loggedInUser.name}!`);
                return true;
            } else {
                toast.error("Invalid email or password");
                return false;
            }
        } catch (error) {
            toast.error("Login failed. Please try again.");
            console.error("Login error:", error);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            const emailExists = await checkEmailExists(email);
            if (emailExists) {
                toast.error("Email already registered");
                return false;
            }

            const newUser = await registerUser({ name, email, password });
            if (newUser) {
                toast.success("Registration successful! Please login.");
                return true;
            }
        } catch (error) {
            toast.error("Registration failed. Please try again.");
            console.error("Registration error:", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        toast.info("Logged out successfully");
    };

    const updateUserProfile = async (updatedData) => {
        try {
            // 1. Update User Profile
            const fullUserData = { ...user, ...updatedData };
            const updatedUser = await updateUser(user.id, fullUserData);
            setUser(updatedUser);
            localStorage.setItem("user", JSON.stringify(updatedUser));

            // 2. Propagate Name Change to Reviews (if name changed)
            if (updatedData.name && updatedData.name !== user.name) {
                const { getReviewsByUserId, updateReview } = await import("../services/reviews");
                const userReviewsRes = await getReviewsByUserId(user.id);
                const userReviews = userReviewsRes.data;

                // Update each review with new name
                await Promise.all(userReviews.map(review =>
                    updateReview(review.id, { ...review, user: updatedData.name })
                ));
            }

            toast.success("Profile updated successfully!");
            return true;
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error("Failed to update profile.");
            return false;
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUserProfile, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
