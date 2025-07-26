import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import "./Upload.css";

export default function Upload() {
    const API_URL = import.meta.env.VITE_API_SERVER_URL;
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [clipTitle, setClipTitle] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [statusMessage, setStatusMessage] = useState("");
    const [statusType, setStatusType] = useState(null); // "error" | "success"

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!clipTitle || !videoFile) {
            setStatusMessage("Title and file are required.");
            setStatusType("error");
            return;
        }

        const formData = new FormData();
        formData.append("title", clipTitle);
        formData.append("video", videoFile);

        try {
            const res = await fetch(`${API_URL}/api/upload/video`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (res.ok) {
                setStatusMessage("Clip uploaded successfully!");
                setStatusType("success");
                setClipTitle("");
                setVideoFile(null);
                setTimeout(() => navigate("/"), 1500);
            } else {
                const errorData = await res.json();
                setStatusMessage(errorData.error || "Upload failed.");
                setStatusType("error");
            }
        } catch {
            setStatusMessage("Something went wrong.");
            setStatusType("error");
        }
    };

    if (!user)
        return (
            <p className="upload-not-logged-in">
                You must be logged in to upload clips.
            </p>
        );

    return (
        <div className="upload-page">
            <div className="upload-card">
                <h2 className="upload-title">Upload New Clip</h2>
                <form onSubmit={handleSubmit} className="upload-form">
                    <input
                        type="text"
                        placeholder="Clip title"
                        value={clipTitle}
                        onChange={(e) => setClipTitle(e.target.value)}
                        className="upload-input"
                        required
                        autoComplete="off"
                    />
                    <input
                        type="file"
                        accept="video/mp4"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                        className="upload-input"
                        required
                    />
                    <button type="submit" className="upload-button">
                        Upload
                    </button>
                </form>
                {statusMessage && (
                    <p
                        className={`upload-status ${
                            statusType === "error" ? "status-error" : "status-success"
                        }`}
                        role="alert"
                    >
                        {statusMessage}
                    </p>
                )}
            </div>
        </div>
    );
}
