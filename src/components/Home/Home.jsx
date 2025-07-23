import {useState, useEffect, useContext} from "react";
import VideoModal from "../VideoModal/VideoModal.jsx";
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
        <div className="Home">
            <div className="controls">
                <label htmlFor="sort-select">Sort by date:</label>
                <select id="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            <div className="video-grid">
                {sortedVideos.map((video) => (
                    <div
                        className="video-card"
                        key={video.id}
                        onClick={() => handleVideoClick(video)}
                    >
                        <div className="thumbnail-container">
                            <video
                                muted
                                preload="metadata"
                                className="thumbnail"
                                onMouseEnter={(e) => e.currentTarget.play()}
                                onMouseLeave={(e) => {
                                    e.currentTarget.pause();
                                    e.currentTarget.currentTime = 0;
                                }}
                                onLoadedMetadata={(e) => {
                                    const duration = e.currentTarget.duration;
                                    const span = e.currentTarget.nextElementSibling;
                                    if (span) {
                                        const minutes = Math.floor(duration / 60);
                                        const seconds = Math.floor(duration % 60)
                                            .toString()
                                            .padStart(2, "0");
                                        span.textContent = `${minutes}:${seconds}`;
                                    }
                                }}
                            >
                                <source src={video.file_url} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>

                            <span className="video-duration">0:00</span>
                        </div>

                        <div className="video-info">
                            <div className="video-header">
                                <span className="video-title">{video.title || "Untitled Video"}</span>
                                <span className="video-date">{new Date(video.uploaded_at).toLocaleDateString()}</span>
                            </div>

                            <span className="video-uploader">Uploaded by: {video.uploader}</span>

                            <div className="video-tags">
                                <span>#placeholder</span>
                                <span>#anotherTag</span>
                            </div>

                            <div className="video-stats">
                                <span>👁️ 1234</span>
                                <span>❤️ 456</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {activeVideo && (
                <VideoModal
                    video={activeVideo}
                    onClose={closeModal}
                    onPrev={activeIndex > 0 ? showPrevVideo : null}
                    onNext={activeIndex < sortedVideos.length - 1 ? showNextVideo : null}
                />
            )}
        </div>
    );
}

export default Home;
