import "./VideoModal.css";

export default function VideoModal({ video, onClose, onPrev, onNext }) {
    if (!video) return null;

    return (
        <div className="video-modal" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <video controls autoPlay src={video.file_url} className="modal-video"/>

                <div className="modal-details">
                    <h2 className="modal-title">{video.title || "Untitled Video"}</h2>

                    <div className="modal-stats-tags">
                        <div className="modal-stats">
                            <span>👁️ {video.views || 0} NEEDS REAL DATA TO WORK</span>
                            <span>❤️ {video.likes || 0} NEEDS REAL DATA TO WORK</span>
                        </div>
                        <div className="modal-tags">
                            <span>#placeholder</span>
                            <span>#anotherTag</span>
                        </div>
                    </div>
                </div>

                <div className="modal-meta">
                    <span>Uploaded by: <strong>{video.uploader || "You"}</strong></span>
                    <span>{new Date(video.uploaded_at).toLocaleDateString()}</span>
                </div>
            </div>

            {onPrev && (
                <button className="modal-nav left" onClick={(e) => {
                    e.stopPropagation();
                    onPrev();
                }}>
                    ❮
                </button>
            )}
            {onNext && (
                <button className="modal-nav right" onClick={(e) => {
                    e.stopPropagation();
                    onNext();
                }}>
                    ❯
                </button>
            )}
        </div>
    );
}
