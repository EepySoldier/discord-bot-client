import "./Settings.css"

export default function Settings({ user }) {

    const clips = user?.clips || [
        { name: "FunnyFail.mp4" },
        { name: "EpicWin.mp4" },
        { name: "CoolScene.mp4" },
        { name: "EpicWin.mp4" },
        { name: "CoolScene.mp4" },
        { name: "CoolScene.mp4" },
        { name: "EpicWin.mp4" },
        { name: "CoolScene.mp4" },
        { name: "CoolScene.mp4" },
        { name: "EpicWin.mp4" },
        { name: "CoolScene.mp4" },
        { name: "CoolScene.mp4" },
        { name: "EpicWin.mp4" },
        { name: "CoolScene.mp4" },
        { name: "CoolScene.mp4" },
        { name: "EpicWin.mp4" },
        { name: "CoolScene.mp4" },
        { name: "CoolScene.mp4" },
        { name: "EpicWin.mp4" },
        { name: "CoolScene.mp4" },

    ];

    if (!user) {
        return <p className="login-required">Log in to manage your settings.</p>;
    }

    return (
        <div className="settings__container">
            <h2 className="settings__header">Settings</h2>
            <p className="settings__subtext">Manage your account, access codes, and uploaded clips here.</p>

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
                    {clips.length > 0 ? (
                        clips.map((clip, index) => (
                            <div className="settings__clip-card" key={index}>
                                <div className="settings__clip-thumbnail">
                                    {/* SVG */}
                                </div>
                                <div className="settings__clip-info" title={clip.name}>
                                    {clip.name}
                                </div>
                                <div className="settings__clip-actions">
                                    <button className="settings__btn-edit">
                                        ✏️ Edit
                                    </button>
                                    <button className="settings__btn-danger">
                                        🗑 Delete
                                    </button>
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
