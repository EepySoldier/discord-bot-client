import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { UserContext } from "./UserContext";

import Header from "./components/Header/Header.jsx";
import Home from "./components/Home/Home.jsx";
import Settings from "./components/Settings/Settings.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import Upload from "./components/Upload/Upload.jsx";

import "./App.css";

function App() {
    const apiUrl = import.meta.env.VITE_API_SERVER_URL;
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`${apiUrl}/api/auth/me`, {
                    credentials: "include",
                });
                if (response.ok) {
                    const userData = await response.json();
                    setUser(userData);
                }
            } catch {}
        })();
    }, [apiUrl]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            <Router>
                <Header />
                <main className="container">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/upload" element={<Upload />} />
                    </Routes>
                </main>
            </Router>
        </UserContext.Provider>
    );
}

export default App;
