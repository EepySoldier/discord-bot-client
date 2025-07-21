import { useEffect, useState } from "react";
import axios from "axios";

export default function Settings({ user }) {
    const [ownedServers, setOwnedServers] = useState([]);
    const [joinCode, setJoinCode] = useState("");
    const [createCode, setCreateCode] = useState("");
    const [selectedServer, setSelectedServer] = useState(null);
    const [message, setMessage] = useState("");
    const [joinedServers, setJoinedServers] = useState([]);

    useEffect(() => {
        if (!user) return;

        axios.get('https://discord-bot-server-production.up.railway.app/api/servers/owned', { withCredentials: true })
            .then(res => setOwnedServers(res.data))
            .catch(() => setOwnedServers([]));

        axios.get('https://discord-bot-server-production.up.railway.app/api/servers/joined', { withCredentials: true })
            .then(res => setJoinedServers(res.data))
            .catch(() => setJoinedServers([]));
    }, [user]);

    const handleCreateCode = async () => {
        if (!selectedServer) return setMessage("Select a server to create a code");

        try {
            const res = await axios.post(
                `https://discord-bot-server-production.up.railway.app/api/servers/${selectedServer.discord_server_id}/create-code`,
                {},
                { withCredentials: true }
            );
            setCreateCode(res.data.access_code);
            setMessage("Code created! Share it with users to join.");
        } catch (err) {
            setMessage("Failed to create code.");
        }
    };

    const handleJoinServer = async () => {
        if (!joinCode.trim()) {
            setMessage("Enter a valid code.");
            return;
        }
        try {
            await axios.post(
                `https://discord-bot-server-production.up.railway.app/api/servers/join`,
                { access_code: joinCode.trim() },
                { withCredentials: true }
            );
            setMessage("Successfully joined server!");
            setJoinCode("");
        } catch (err) {
            setMessage("Failed to join server. Check the code.");
        }
    };

    if (!user) return <p>Please login to manage servers.</p>;

    return (
        <div>
            <h2>Server Settings</h2>

            <div>
                <h3>Your Owned Servers</h3>
                {ownedServers.length > 0 ? (
                    <select
                        onChange={(e) => {
                            const server = ownedServers.find(s => s.discord_server_id === e.target.value);
                            setSelectedServer(server);
                            setCreateCode("");
                            setMessage("");
                        }}
                        value={selectedServer?.discord_server_id || ""}
                    >
                        <option value="">-- Select a server --</option>
                        {ownedServers.map(server => (
                            <option key={server.discord_server_id} value={server.discord_server_id}>
                                {server.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p>You do not own any servers.</p>
                )}
                {selectedServer && (
                    <>
                        <button onClick={handleCreateCode}>Create Server Code</button>
                        {createCode && <p>Access Code: <strong>{createCode}</strong></p>}
                    </>
                )}
            </div>

            <hr />

            <div>
                <h3>Join a Server</h3>
                <input
                    type="text"
                    placeholder="Enter server code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                />
                <button onClick={handleJoinServer}>Join</button>
            </div>
            <h3>Servers you've joined already</h3>
            {joinedServers.map(serverEntry => (
                <span key={serverEntry.name}>{serverEntry.name} ({serverEntry.access_code})</span>
            ))}

            {message && <p>{message}</p>}
        </div>
    );
}
