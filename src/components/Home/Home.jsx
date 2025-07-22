import { useContext } from "react";
import { UserContext } from "../../UserContext";

function Home() {
    const { user } = useContext(UserContext);
    const dummyVideos = [
        {
            id: "1",
            title: "Epic Moment",
            file_url: "/videos/sample1.mp4",
            uploaded_at: new Date().toISOString(),
            uploader: "alice",
        },
        {
            id: "2",
            title: "Funny Fail",
            file_url: "/videos/sample2.mp4",
            uploaded_at: new Date().toISOString(),
            uploader: "bob",
        },
        {
            id: "1",
            title: "Epic Moment",
            file_url: "/videos/sample1.mp4",
            uploaded_at: new Date().toISOString(),
            uploader: "alice",
        },
        {
            id: "2",
            title: "Funny Fail",
            file_url: "/videos/sample2.mp4",
            uploaded_at: new Date().toISOString(),
            uploader: "bob",
        },
        {
            id: "1",
            title: "Epic Moment",
            file_url: "/videos/sample1.mp4",
            uploaded_at: new Date().toISOString(),
            uploader: "alice",
        },
        {
            id: "2",
            title: "Funny Fail",
            file_url: "/videos/sample2.mp4",
            uploaded_at: new Date().toISOString(),
            uploader: "bob",
        },
        {
            id: "1",
            title: "Epic Moment",
            file_url: "/videos/sample1.mp4",
            uploaded_at: new Date().toISOString(),
            uploader: "alice",
        },
        {
            id: "2",
            title: "Funny Fail",
            file_url: "/videos/sample2.mp4",
            uploaded_at: new Date().toISOString(),
            uploader: "bob",
        },
    ];

    if (!user) {
        return <p className="login-required">Please log in to view or upload videos.</p>;
    }

    return (
        <>
            <div className="controls">
                <label htmlFor="sort-select">Sort by date:</label>
                <select id="sort-select" defaultValue="desc">
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                </select>
            </div>

            <div className="videos">
                {dummyVideos.map((video) => (
                    <div className="video-card" key={video.id}>
                        <div className="video-wrapper">
                            <video controls preload="metadata" muted>
                                <source src={video.file_url} type="video/mp4"/>
                                Your browser does not support the video tag.
                            </video>
                            <div className="video-meta">
                                <span className="video-uploader">{video.uploader}</span>
                                <span className="video-date">📅 {new Date(video.uploaded_at).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}

export default Home;
