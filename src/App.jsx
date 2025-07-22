import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Settings from "./components/Settings/Settings.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import "./App.css";

function Header({ user, onLogout }) {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo-link" style={{ textDecoration: "none", color: "inherit" }}>
                    <h1>🎥 Clip Archive</h1>
                </Link>
            </div>
            <div className="navbar-right">
                {user ? (
                    <>
                        <Link
                            to="/settings"
                            className="user-info"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                textDecoration: "none",
                                color: "inherit",
                            }}
                        >
                            <div className="avatar-placeholder">{user.username[0]}</div>
                            <span>{user.username}</span>
                        </Link>
                        <button
                            className="btn logout-btn"
                            onClick={async () => {
                                await fetch("http://localhost:5000/api/auth/logout", {
                                    method: "POST",
                                    credentials: "include",
                                });
                                onLogout();
                            }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn login-btn">
                            Login
                        </Link>
                        <Link to="/register" className="btn register-btn">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

function Home({ user }) {
    // your existing Home component code here
    // ...
    if (!user) {
        return <p className="login-required">Please log in to view or upload videos.</p>;
    }
    // ...
    return <>{/* ...videos list... */}</>;
}

function App() {
    const [user, setUser] = useState(null);

    // On mount, check if user is already logged in via session
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("http://localhost:5000/api/auth/me", {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                // ignore errors here
            }
        })();
    }, []);

    return (
        <Router>
            <Header user={user} onLogout={() => setUser(null)} />
            <main className="container">
                <Routes>
                    <Route path="/" element={<Home user={user} />} />
                    <Route path="/settings" element={<Settings user={user} />} />
                    <Route path="/login" element={<Login onLogin={setUser} />} />
                    <Route path="/register" element={<Register onRegister={setUser} />} />
                </Routes>
            </main>
        </Router>
    );
}

export default App;
