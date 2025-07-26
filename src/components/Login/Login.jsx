import "./Login.css";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

export default function Login() {
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const [credentials, setCredentials] = useState({ identifier: "", password: "" });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch(`${API_SERVER_URL}/api/auth/login`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailOrUsername: credentials.identifier,
                    password: credentials.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Login failed");
            } else {
                setUser(data);
                navigate("/");
            }
        } catch {
            setError("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="Login__form">
            <h2 className="Login__title">Login</h2>
            {error && <div className="Login__error">{error}</div>}

            <input
                className="Login__input"
                type="text"
                name="identifier"
                placeholder="Email or Username"
                value={credentials.identifier}
                onChange={handleChange}
                required
                autoComplete="off"
            />

            <input
                className="Login__input"
                type="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
            />

            <button className="Login__button" type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}
