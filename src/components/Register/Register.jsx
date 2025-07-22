import "./Register.css";
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../UserContext";

export default function Register() {
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const [form, setForm] = useState({ email: "", username: "", password: "" });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_SERVER_URL}/api/auth/me`, { credentials: "include" })
            .then(res => res.ok && navigate("/"))
            .catch(() => {});
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${API_SERVER_URL}/api/auth/register`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (res.ok) {
                setUser(data); // ⬅️ Use context instead of prop
                navigate("/");
            } else {
                setError(data.error || "Registration failed");
            }
        } catch {
            setError("Network error");
        } finally {
            setLoading(false);
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
                value={form.email}
                onChange={handleChange}
                required
            />
            <input
                className="Register__input"
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
            />
            <input
                className="Register__input"
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
            />
            <button className="Register__button" type="submit" disabled={loading}>
                {loading ? "Registering..." : "Register"}
            </button>
        </form>
    );
}
