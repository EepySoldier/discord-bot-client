import "./Register.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

export default function Register() {
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const [formData, setFormData] = useState({ email: "", username: "", password: "" });
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_SERVER_URL}/api/auth/me`, { credentials: "include" })
            .then(res => res.ok && navigate("/"))
            .catch(() => {});
    }, [navigate, API_SERVER_URL]);

    const handleChange = ({ target: { name, value } }) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await fetch(`${API_SERVER_URL}/api/auth/register`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setUser(data);
                navigate("/");
            } else {
                setError(data.error || "Registration failed");
            }
        } catch {
            setError("Network error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="Register__form">
            <h2 className="Register__title">Register</h2>
            {error && <div className="Register__error">{error}</div>}

            <input
                className="Register__input"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="off"
            />
            <input
                className="Register__input"
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="off"
            />
            <input
                className="Register__input"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
            />
            <button className="Register__button" type="submit" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
            </button>
        </form>
    );
}
