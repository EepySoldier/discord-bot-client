import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../UserContext";

function Header() {
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
    const { user, setUser } = useContext(UserContext);

    const handleLogout = async () => {
        await fetch(`${API_SERVER_URL}/api/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        setUser(null);
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo-link">
                    <h1>Clip Archive</h1>
                </Link>
                {user && <Link to="/upload" className="upload-link">Upload Clips</Link>}
            </div>
            <div className="navbar-right">
                {user ? (
                    <>
                        <Link to="/settings" className="user-info" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "inherit" }}>
                            {user.profile_pic_url ? (
                                <img alt="avatar" className="avatar" src={user.profile_pic_url} />
                            ) : (
                                <div className="avatar-placeholder">{user.username[0]}</div>
                            )}
                            <span>{user.username}</span>
                        </Link>
                        <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="btn login-btn">Login</Link>
                        <Link to="/register" className="btn register-btn">Register</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Header;
