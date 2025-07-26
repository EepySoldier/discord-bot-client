import { useState, useEffect, useContext } from "react";
import VideoModal from "../VideoModal/VideoModal.jsx";
import VideoThumbnail from "../VideoThumbnail/VideoThumbnail.jsx";
import { UserContext } from "../../UserContext";

export default function Home() {
    const API_URL = import.meta.env.VITE_API_SERVER_URL;
    const { user } = useContext(UserContext);

    const [videos, setVideos] = useState([]);
    const [sortOrder, setSortOrder] = useState("desc");
    const [selectedVideo, setSelectedVideo] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [hoveredVideoId, setHoveredVideoId] = useState(null);
    const [isSeeking, setIsSeeking] = useState(false);
    const [recentlyDraggedId, setRecentlyDraggedId] = useState(null);

    useEffect(() => {
        const loadVideos = async () => {
            try {
                const res = await fetch(`${API_URL}/api/video/fetchAll`, {
                    credentials: "include",
                });
                if (res.ok) setVideos(await res.json());
            } catch (err) {
                console.error("Failed to load videos", err);
            }
        };
        loadVideos();
    }, [API_URL]);

    const sortedVideos = [...videos].sort((a, b) =>
        sortOrder === "asc"
            ? new Date(a.uploaded_at) - new Date(b.uploaded_at)
            : new Date(b.uploaded_at) - new Date(a.uploaded_at)
    );

    const openVideo = async (video) => {
        try {
            await fetch(`${API_URL}/api/video/${video.id}/view`, {
                method: "POST",
                credentials: "include",
            });
        } catch (err) {
            console.error(err);
        }

        const index = sortedVideos.findIndex((v) => v.id === video.id);
        setSelectedIndex(index);
        setSelectedVideo(video);
    };

    if (!user) {
        return <p className="login-required">Please log in to view or upload videos.</p>;
    }

    return (
        <div className="Home">
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

            <div className="video-grid">
                {sortedVideos.map((video) => (
                    <div
                        key={video.id}
                        className="video-card"
                        onMouseEnter={() => setHoveredVideoId(video.id)}
                        onMouseLeave={() => !isSeeking && setHoveredVideoId(null)}
                        onClick={() => {
                            if (recentlyDraggedId === video.id) {
                                setRecentlyDraggedId(null);
                                return;
                            }
                            if (!isSeeking) openVideo(video);
                        }}
                    >
                        <VideoThumbnail
                            src={video.file_url}
                            preview={hoveredVideoId === video.id}
                            setIsSeeking={setIsSeeking}
                            setJustDraggedId={setRecentlyDraggedId}
                            videoId={video.id}
                        />

                        <div className="video-info">
                            <div className="video-header">
                                <span className="video-title">{video.title || "Untitled Video"}</span>
                                <span className="video-date">
                  {new Date(video.uploaded_at).toLocaleDateString("en-GB")}
                </span>
                            </div>

                            <span className="video-uploader">Uploaded by: {video.uploader}</span>

                            <div className="video-tags">
                                <span>#placeholder</span>
                                <span>#anotherTag</span>
                            </div>

                            <div className="video-stats">
                                <span>👁️ {video.views ?? 0}</span>
                                <span>❤️ {video.likes ?? 0}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedVideo && (
                <VideoModal
                    video={selectedVideo}
                    onClose={() => setSelectedVideo(null)}
                    onPrev={
                        selectedIndex > 0
                            ? () => {
                                const prevIndex = selectedIndex - 1;
                                setSelectedIndex(prevIndex);
                                setSelectedVideo(sortedVideos[prevIndex]);
                            }
                            : null
                    }
                    onNext={
                        selectedIndex < sortedVideos.length - 1
                            ? () => {
                                const nextIndex = selectedIndex + 1;
                                setSelectedIndex(nextIndex);
                                setSelectedVideo(sortedVideos[nextIndex]);
                            }
                            : null
                    }
                    onLikeToggle={(liked, newLikes) => {
                        setVideos((prev) =>
                            prev.map((v) =>
                                v.id === selectedVideo.id
                                    ? { ...v, liked_by_me: liked, likes: newLikes }
                                    : v
                            )
                        );
                        setSelectedVideo((v) => ({ ...v, liked_by_me: liked, likes: newLikes }));
                    }}
                />
            )}
        </div>
    );
}
