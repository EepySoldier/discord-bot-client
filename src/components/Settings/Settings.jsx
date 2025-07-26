import { useState, useEffect, useContext } from "react";
import { UserContext } from "../../UserContext";
import VideoModal from "../VideoModal/VideoModal.jsx";
import VideoThumbnail from "../VideoThumbnail/VideoThumbnail.jsx";
import "./Settings.css";

export default function Settings() {
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
    const { user, setUser } = useContext(UserContext);

    const [isUploading, setIsUploading] = useState(false);
    const [profilePic, setProfilePic] = useState("");
    const [clips, setClips] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    const [hoveredClipId, setHoveredClipId] = useState(null);
    const [seeking, setSeeking] = useState(false);
    const [recentlyDraggedId, setRecentlyDraggedId] = useState(null);

    useEffect(() => {
        if (user?.profile_pic_url) setProfilePic(user.profile_pic_url);
    }, [user]);

    useEffect(() => {
        if (!user?.id) return;
        (async () => {
            try {
                const res = await fetch(`${API_SERVER_URL}/api/video/fetchByUser/${user.id}`, {
                    credentials: "include",
                });
                if (res.ok) setClips(await res.json());
            } catch (e) {
                console.error("Error fetching clips", e);
            }
        })();
    }, [user, API_SERVER_URL]);

    const onProfilePicChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setIsUploading(true);

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
                setProfilePic(data.profilePicUrl);
                setUser(prev => ({ ...prev, profile_pic_url: data.profilePicUrl }));
            } else {
                alert(data.error || "Upload failed");
            }
        } catch {
            alert("Upload error");
        } finally {
            setIsUploading(false);
        }
    };

    const openModal = (idx) => setActiveIndex(idx);
    const closeModal = () => setActiveIndex(null);
    const showPrev = () => setActiveIndex(i => (i > 0 ? i - 1 : i));
    const showNext = () => setActiveIndex(i => (i < clips.length - 1 ? i + 1 : i));

    if (!user) return <p className="login-required">Log in to manage your settings.</p>;

    return (
        <div className="settings__container">
            <h2 className="settings__header">Settings</h2>
            <p className="settings__subtext">
                Manage your account, access codes, and uploaded clips here.
            </p>

            <div className="settings__section settings__profile-section">
                <div className="settings__profile-wrapper">
                    {profilePic ? (
                        <img src={profilePic} alt="Profile" className="settings__profile-pic" />
                    ) : (
                        <div className="settings__profile-placeholder" />
                    )}
                    <div className="settings__profile-info">
                        <p className="settings__nickname">{user.nickname || user.username || "User"}</p>
                        <p className="settings__join-date">
                            Joined: {new Date(user.created_at).toLocaleDateString("en-GB")}
                        </p>
                        <input type="file" accept="image/*" disabled={isUploading} onChange={onProfilePicChange} />
                        {isUploading && <p>Uploading...</p>}
                    </div>
                </div>
            </div>

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

            <div className="settings__section">
                <h3>My Clips</h3>
                <p className="settings__section-description">View and manage your uploaded videos.</p>
                <div className="settings__clip-scroll-container">
                    {clips.length ? (
                        clips.map((clip, idx) => (
                            <div
                                key={clip.id}
                                className="settings__clip-card"
                                onMouseEnter={() => setHoveredClipId(clip.id)}
                                onMouseLeave={() => !seeking && setHoveredClipId(null)}
                                onClick={() => {
                                    if (recentlyDraggedId === clip.id) {
                                        setRecentlyDraggedId(null);
                                        return;
                                    }
                                    if (!seeking) openModal(idx);
                                }}
                            >
                                <VideoThumbnail
                                    src={clip.file_url}
                                    preview={hoveredClipId === clip.id}
                                    setIsSeeking={setSeeking}
                                    setJustDraggedId={setRecentlyDraggedId}
                                    videoId={clip.id}
                                />
                                <div className="settings__clip-info" title={clip.title || "Untitled"}>
                                    {clip.title || "Untitled"}
                                </div>
                                <div className="settings__clip-meta">
                                    <span>👁️ {clip.views ?? 0} ❤️ {clip.likes ?? 0}</span>
                                    <span>{new Date(clip.uploaded_at).toLocaleDateString("en-GB")}</span>
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

            {activeIndex !== null && (
                <VideoModal
                    video={clips[activeIndex]}
                    onClose={closeModal}
                    onPrev={activeIndex > 0 ? showPrev : null}
                    onNext={activeIndex < clips.length - 1 ? showNext : null}
                    onLikeToggle={(liked, count) => {
                        setClips(prev => {
                            const updated = [...prev];
                            updated[activeIndex] = { ...updated[activeIndex], liked_by_me: liked, likes: count };
                            return updated;
                        });
                    }}
                />
            )}
        </div>
    );
}
