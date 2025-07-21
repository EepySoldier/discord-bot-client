import {useEffect, useState} from "react";
import axios from "axios";
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom";
import Settings from "./Settings";
import "./App.css";

function Header({user, onLogout}) {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo-link" style={{textDecoration: "none", color: "inherit"}}>
                    <h1>🎥 Clip Archive</h1>
                </Link>
            </div>
            <div className="navbar-right">
                {user ? (
                    <>
                        <Link to="/settings" className="user-info" style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            textDecoration: "none",
                            color: "inherit"
                        }}>
                            <img
                                src={`https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`}
                                alt="avatar"
                                width={32}
                                height={32}
                                style={{borderRadius: "50%"}}
                            />
                            <span>{user.username}</span>
                        </Link>
                        <button className="btn logout-btn" onClick={onLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <button className="btn login-btn"
                            onClick={() => window.location.href = "https://discord-bot-server-production.up.railway.app/auth/discord"}>
                        Login with Discord
                    </button>
                )}
            </div>
        </nav>
    );
}

function Home({user}) {
    const [videos, setVideos] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc");
    const [joinedServers, setJoinedServers] = useState([]);

    useEffect(() => {
        if (!user) {
            setVideos([]);
            setJoinedServers([]);
            return;
        }
        // Fetch servers user joined
        axios.get('https://discord-bot-server-production.up.railway.app/api/servers/joined', {withCredentials: true})
            .then(res => setJoinedServers(res.data))
            .catch(() => setJoinedServers([]));
    }, [user]);

    useEffect(() => {
        if (!user || joinedServers.length === 0) {
            setVideos([]);
            return;
        }

        // Fetch videos only if user joined at least one server
        axios.get(`https://discord-bot-server-production.up.railway.app/api/videos?sort=${sortOrder}`, {withCredentials: true})
            .then(res => {
                if (Array.isArray(res.data)) setVideos(res.data);
                else setVideos([]);
            })
            .catch(() => setVideos([]));
    }, [sortOrder, user, joinedServers]);

    if (!user) {
        return <p className="login-required">Please log in to view videos.</p>;
    }

    if (joinedServers.length === 0) {
        return <p className="login-required">Join a server via settings to view videos.</p>;
    }

    return (
        <>
            <div className="controls">
                <label htmlFor="sort-select">Sort by date:</label>
                <select
                    id="sort-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            <div className="videos">
                {videos.length > 0 ? (
                    videos.map((video) => (
                        <div className="video-card" key={video.id}>
                            <h3>{video.activity_name}</h3>
                            <div className="video-meta">
                                <p className="upload-date">{new Date(video.upload_date).toLocaleString()}</p>
                                <p className="video-owner">{video.video_owner}</p>
                            </div>
                            <div className="video-wrapper">
                                <video width="100%" controls preload="metadata">
                                    <source src={video.file_url} type="video/mp4"/>
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-videos">No videos yet.</p>
                )}
            </div>
        </>
    );
}

function App() {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const res = await axios.get('https://discord-bot-server-production.up.railway.app/api/user', {withCredentials: true});
            setUser(res.data);
        } catch {
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('https://discord-bot-server-production.up.railway.app/api/logout', null, {withCredentials: true});
            setUser(null);
        } catch (err) {
            console.error("Logout failed", err);
        }
    };

    return (
        <Router>
            <Header user={user} onLogout={handleLogout}/>
            <main className="container">
                <Routes>
                    <Route path="/" element={<Home user={user}/>}/>
                    <Route path="/settings" element={<Settings user={user}/>}/>
                </Routes>
            </main>
        </Router>
    );
}

export default App;
