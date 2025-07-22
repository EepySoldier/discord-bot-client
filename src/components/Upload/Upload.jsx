import { useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import "./Upload.css"

function Upload() {
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file || !title) {
            return setMessage("Title and file are required.");
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("video", file);

        try {
            const res = await fetch(`${API_SERVER_URL}/api/upload/video`, {
                method: "POST",
                body: formData,
                credentials: "include",
            });

            if (res.ok) {
                setMessage("Clip uploaded successfully!");
                setTitle("");
                setFile(null);
                navigate("/");
            } else {
                const err = await res.json();
                setMessage(err.error || "Upload failed.");
            }
        } catch (err) {
            setMessage("Something went wrong.");
        }
    };

    if (!user) return <p>You must be logged in to upload clips.</p>;

    return (
        <div className="upload-page">
            <h2>Upload New Clip</h2>
            <form onSubmit={handleUpload}>
                <input
                    type="text"
                    placeholder="Clip title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    type="file"
                    accept="video/mp4"
                    onChange={(e) => setFile(e.target.files[0])}
                    required
                />
                <button type="submit">Upload</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Upload;
