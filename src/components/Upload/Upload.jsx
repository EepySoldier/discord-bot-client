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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!clipTitle || !videoFile) {
            setStatusMessage("Title and file are required.");
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
                setClipTitle("");
                setVideoFile(null);
                navigate("/");
            } else {
                const errorData = await res.json();
                setStatusMessage(errorData.error || "Upload failed.");
            }
        } catch {
            setStatusMessage("Something went wrong.");
        }
    };

    if (!user) return <p>You must be logged in to upload clips.</p>;

    return (
        <div className="upload-page">
            <h2>Upload New Clip</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Clip title"
                    value={clipTitle}
                    onChange={(e) => setClipTitle(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept="video/mp4"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                    required
                />
                <button type="submit">Upload</button>
            </form>
            {statusMessage && <p>{statusMessage}</p>}
        </div>
    );
}
