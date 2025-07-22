// src/App.jsx
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { UserContext } from "./UserContext";

import Header from "./components/Header/Header.jsx";
import Home from "./components/Home/Home.jsx";
import Settings from "./components/Settings/Settings.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";

import "./App.css";

function App() {
    const API_SERVER_URL = import.meta.env.VITE_API_SERVER_URL;
    const [user, setUser] = useState(null);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`${API_SERVER_URL}/api/auth/me`, {
                    credentials: "include",
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                }
            } catch (err) {
                // handle error if needed
            }
        })();
    }, []);

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
                    </Routes>
                </main>
            </Router>
        </UserContext.Provider>
    );
}

export default App;
