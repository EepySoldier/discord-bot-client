import {useState, useEffect, useContext} from "react";
import {UserContext} from "../../UserContext";

function Home() {
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
    const {user} = useContext(UserContext);
    const [videos, setVideos] = useState([]);
    const [sort, setSort] = useState("desc");
    const [activeVideo, setActiveVideo] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);

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

    const handleVideoClick = (video) => {
        const index = sortedVideos.findIndex((v) => v.id === video.id);
        setActiveIndex(index);
        setActiveVideo(video);
    };

    const closeModal = () => {
        setActiveVideo(null);
    };

    const showPrevVideo = () => {
        if (activeIndex > 0) {
            const newIndex = activeIndex - 1;
            setActiveIndex(newIndex);
            setActiveVideo(sortedVideos[newIndex]);
        }
    };

    const showNextVideo = () => {
        if (activeIndex < sortedVideos.length - 1) {
            const newIndex = activeIndex + 1;
            setActiveIndex(newIndex);
            setActiveVideo(sortedVideos[newIndex]);
        }
    };

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
                    <div
                        className="video-card"
                        key={video.id}
                        onClick={() => handleVideoClick(video)}
                    >
                        <div className="video-wrapper">
                            <video
                                muted
                                preload="metadata"
                                onMouseEnter={(e) => e.currentTarget.play()}
                                onMouseLeave={(e) => {
                                    e.currentTarget.pause();
                                    e.currentTarget.currentTime = 0;
                                }}
                            >
                                <source src={video.file_url} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                            <div className="video-meta">
                                <span className="video-uploader">{video.uploader}</span>
                                <span className="video-date">
                                    📅 {new Date(video.uploaded_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {activeVideo && (
                <div className="video-modal" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-btn" onClick={closeModal}>✖</button>

                        {/* Left arrow */}
                        {activeIndex > 0 && (
                            <button className="nav-arrow left-arrow" onClick={showPrevVideo}>
                                ←
                            </button>
                        )}

                        <video
                            controls
                            autoPlay
                            src={activeVideo.file_url}
                            className="modal-video"
                        />

                        {/* Right arrow */}
                        {activeIndex < sortedVideos.length - 1 && (
                            <button className="nav-arrow right-arrow" onClick={showNextVideo}>
                                →
                            </button>
                        )}

                        <div className="modal-meta">
                            <span>Uploaded by: {activeVideo.uploader}</span>
                            <span>Date: {new Date(activeVideo.uploaded_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Home;
