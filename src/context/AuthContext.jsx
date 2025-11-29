import { createContext, useState, useEffect, useContext } from "react";
import { loginUser, registerUser, checkEmailExists } from "../services/auth";
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

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
