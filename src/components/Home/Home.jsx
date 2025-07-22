import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext";

function Home() {
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
    const { user } = useContext(UserContext);
    const [videos, setVideos] = useState([]);
    const [sort, setSort] = useState("desc");

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const res = await fetch(`${API_SERVER_URL}/api/video/fetchAll`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setVideos(data);
                }
            } catch (err) {
                console.error("Failed to load videos", err);
            }
        };
        fetchVideos();
    }, []);

    const sortedVideos = [...videos].sort((a, b) => {
        return sort === "asc"
            ? new Date(a.uploaded_at) - new Date(b.uploaded_at)
            : new Date(b.uploaded_at) - new Date(a.uploaded_at);
    });

    if (!user) {
        return <p className="login-required">Please log in to view or upload videos.</p>;
    }

    return (
        <>
            <div className="controls">
                <label htmlFor="sort-select">Sort by date:</label>
                <select id="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            <div className="videos">
                {sortedVideos.map((video) => (
                    <div className="video-card" key={video.id}>
                        <div className="video-wrapper">
                            <video controls preload="metadata" muted>
                                <source src={video.file_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="video-meta">
                                <span className="video-uploader">{video.uploader}</span>
                                <span className="video-date">📅 {new Date(video.uploaded_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Home;
