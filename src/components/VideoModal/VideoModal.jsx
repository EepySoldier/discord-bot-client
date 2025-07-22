import "./VideoModal.css";

export default function VideoModal({ video, onClose, onPrev, onNext }) {
    if (!video) return null;

    return (
        <div className="video-modal" onClick={onClose}>
            {onPrev && <button className="modal-nav left" onClick={(e) => {
                e.stopPropagation();
                onPrev();
            }}>←</button>}
            {onNext && <button className="modal-nav right" onClick={(e) => {
                e.stopPropagation();
                onNext();
            }}>→</button>}

            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>✖</button>

                <video controls autoPlay src={video.file_url} className="modal-video"/>
                <div className="modal-meta">
                    <span>Uploaded by: {video.uploader || "You"}</span>
                    <span>Date: {new Date(video.uploaded_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
    );
}
