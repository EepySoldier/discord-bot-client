import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../UserContext";
import VideoModal from "../VideoModal/VideoModal.jsx";
import "./Settings.css";

export default function Settings() {
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
    const { user, setUser } = useContext(UserContext);
    const [uploading, setUploading] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [clips, setClips] = useState([]);
    const [activeClipIndex, setActiveClipIndex] = useState(null);

    useEffect(() => {
        if (user?.profile_pic_url) {
            setProfilePicUrl(user.profile_pic_url);
        }
    }, [user]);

    useEffect(() => {
        const fetchClips = async () => {
            try {
                const res = await fetch(`${API_SERVER_URL}/api/video/fetchByUser/${user.id}`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setClips(data);
                }
            } catch (err) {
                console.error("Failed to fetch user's clips", err);
            }
        };

        if (user?.id) {
            fetchClips();
        }
    }, [user]);

    async function handleProfilePicChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            const res = await fetch(`${API_SERVER_URL}/api/user/profile-pic`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setProfilePicUrl(data.profilePicUrl);
                setUser(prev => ({ ...prev, profile_pic_url: data.profilePicUrl }));
            } else {
                alert(data.error || "Upload failed");
            }
        } catch (err) {
            alert("Upload error");
        } finally {
            setUploading(false);
        }
    }

    const handleClipClick = (index) => {
        setActiveClipIndex(index);
    };

    const closeModal = () => setActiveClipIndex(null);

    const handlePrev = () => {
        setActiveClipIndex((prev) => (prev > 0 ? prev - 1 : prev));
    };

    const handleNext = () => {
        setActiveClipIndex((prev) => (prev < clips.length - 1 ? prev + 1 : prev));
    };

    if (!user) {
        return <p className="login-required">Log in to manage your settings.</p>;
    }

    return (
        <div className="settings__container">
            <h2 className="settings__header">Settings</h2>
            <p className="settings__subtext">Manage your account, access codes, and uploaded clips here.</p>

            {/* Profile Picture Section */}
            <div className="settings__section settings__profile-section">
                <div className="settings__profile-wrapper">
                    {profilePicUrl ? (
                        <img src={profilePicUrl} alt="Profile" className="settings__profile-pic" />
                    ) : (
                        <div className="settings__profile-placeholder" />
                    )}
                    <div className="settings__profile-info">
                        <p className="settings__nickname">{user.nickname || user.username || "User"}</p>
                        <p className="settings__join-date">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
                        <input
                            type="file"
                            accept="image/*"
                            disabled={uploading}
                            onChange={handleProfilePicChange}
                        />
                        {uploading && <p>Uploading...</p>}
                    </div>
                </div>
            </div>

            {/* Access Codes Section */}
            <div className="settings__section">
                <h3>Access Codes</h3>
                <p className="settings__section-description">
                    Create or join group codes to share and view videos with others.
                </p>
                <div className="settings__btn-group">
                    <button className="btn">➕ Create New Access Code</button>
                    <button className="btn">🔑 Join Existing Access Code</button>
                </div>
            </div>

            {/* Clips Section */}
            <div className="settings__section">
                <h3>My Clips</h3>
                <p className="settings__section-description">View and manage your uploaded videos.</p>
                <div className="settings__clip-scroll-container">
                    {clips.length > 0 ? (
                        clips.map((clip, index) => (
                            <div
                                className="settings__clip-card"
                                key={index}
                                onClick={() => handleClipClick(index)}
                            >
                                <video
                                    src={clip.file_url}
                                    className="settings__clip-thumbnail"
                                    muted
                                    preload="metadata"
                                />
                                <div className="settings__clip-info" title={clip.title}>
                                    {clip.title}
                                </div>
                                <div className="settings__clip-actions">
                                    <button className="settings__btn-edit">✏️ Edit</button>
                                    <button className="settings__btn-danger">🗑 Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-videos">No clips uploaded yet.</p>
                    )}
                </div>
            </div>

            {activeClipIndex !== null && (
                <VideoModal
                    video={clips[activeClipIndex]}
                    onClose={closeModal}
                    onPrev={activeClipIndex > 0 ? handlePrev : null}
                    onNext={activeClipIndex < clips.length - 1 ? handleNext : null}
                />
            )}
        </div>
    );
}
