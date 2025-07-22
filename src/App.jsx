import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Settings from "./components/Settings/Settings.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import "./App.css";

function Header({ user, onLogout }) {
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
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
                                await fetch(`${API_SERVER_URL}/api/auth/logout`, {
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
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
    const dummyVideos = [
        {
            id: "1",
            title: "Epic Moment",
            file_url: "/videos/sample1.mp4",
            uploaded_at: new Date().toISOString(),
            uploader: "alice",
        },
        {
            id: "2",
            title: "Funny Fail",
            file_url: "/videos/sample2.mp4",
            uploaded_at: new Date().toISOString(),
            uploader: "bob",
        },
    ];

    if (!user) {
        return <p className="login-required">Please log in to view or upload videos.</p>;
    }

    return (
        <>
            <div className="controls">
                <label htmlFor="sort-select">Sort by date:</label>
                <select id="sort-select" defaultValue="desc">
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            <div className="videos">
                {dummyVideos.map((video) => (
                    <div className="video-card" key={video.id}>
                        <h3 className="video-title">{video.title}</h3>
                        <div className="video-meta">
                            <span className="video-date">📅 {new Date(video.uploaded_at).toLocaleString()}</span>
                            <span className="video-uploader">👤 {video.uploader}</span>
                        </div>
                        <div className="video-wrapper">
                            <video width="100%" controls preload="metadata">
                                <source src={video.file_url} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

function App() {
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;

    const [user, setUser] = useState(null);

    // On mount, check if user is already logged in via session
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_SERVER_URL}/api/auth/me`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {

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
