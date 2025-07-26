import { useState } from "react";
import "./VideoModal.css";

export default function VideoModal({ video, onClose, onPrev, onNext, onLikeToggle }) {
    if (!video) return null;

    const API_URL = import.meta.env.VITE_API_SERVER_URL;
    const [isLiked, setIsLiked] = useState(video.liked_by_me);
    const [likeCount, setLikeCount] = useState(Number(video.likes));

    const handleLikeToggle = async () => {
        try {
            const res = await fetch(`${API_URL}/api/video/${video.id}/like`, {
                method: "POST",
                credentials: "include",
            });
            const { liked } = await res.json();
            setIsLiked(liked);
            setLikeCount((count) => {
                const updatedCount = count + (liked ? 1 : -1);
                if (onLikeToggle) onLikeToggle(liked, updatedCount);
                return updatedCount;
            });
        } catch {
            // fail silently
        }
    };

    return (
        <div className="video-modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <video controls autoPlay src={video.file_url} className="modal-video" />

                <div className="modal-details">
                    <h2 className="modal-title">{video.title || "Untitled Video"}</h2>
                    <div className="modal-stats-tags">
                        <div className="modal-stats">
                            <span>👁️ {video.views || 0} Views</span>
                            <span className="like-btn" onClick={handleLikeToggle}>
                {isLiked ? "💖" : "🤍"} {likeCount} Likes
              </span>
                        </div>
                        <div className="modal-tags">
                            <span>#placeholder</span>
                            <span>#anotherTag</span>
                        </div>
                    </div>
                </div>

                <div className="modal-meta">
          <span>
            Uploaded by: <strong>{video.uploader || "You"}</strong>
          </span>
                    <span>{new Date(video.uploaded_at).toLocaleDateString("en-GB")}</span>
                </div>
            </div>

            {onPrev && (
                <button
                    className="modal-nav left"
                    onClick={(e) => {
                        e.stopPropagation();
                        onPrev();
                    }}
                >
                    ❮
                </button>
            )}
            {onNext && (
                <button
                    className="modal-nav right"
                    onClick={(e) => {
                        e.stopPropagation();
                        onNext();
                    }}
                >
                    ❯
                </button>
            )}
        </div>
    );
}
