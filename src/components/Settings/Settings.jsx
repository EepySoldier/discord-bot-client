import { useState, useContext, useEffect } from "react";
import { UserContext } from "../../UserContext";
import "./Settings.css";

export default function Settings() {
    const { user, setUser } = useContext(UserContext);
    const [uploading, setUploading] = useState(false);
    const [profilePicUrl, setProfilePicUrl] = useState("");

    useEffect(() => {
        if (user?.profile_pic_url) {
            setProfilePicUrl(user.profile_pic_url);
        }
    }, [user]);

    const clips = user?.clips || Array(20).fill({ name: "CoolScene.mp4" });

    async function handleProfilePicChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            const res = await fetch("http://localhost:5000/api/user/profile-pic", {
                method: "POST",
                credentials: "include",
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                setProfilePicUrl(data.profilePicUrl);
                // Update user in context
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
                            <div className="settings__clip-card" key={index}>
                                <div className="settings__clip-thumbnail" />
                                <div className="settings__clip-info" title={clip.name}>
                                    {clip.name}
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
        </div>
    );
}
