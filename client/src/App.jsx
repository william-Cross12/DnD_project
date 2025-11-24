// src/App.jsx
import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import MapCanvas from "./MapCanvas";

const SERVER_URL = "http://localhost:4000";

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const s = io(SERVER_URL, { autoConnect: true });
    setSocket(s);

    s.on("connect", () => {
      setConnected(true);

      // TEMP — put your real campaignId/userId here
      s.emit("join-room", {
        campaignId: "YOUR_CAMPAIGN_ID",
        userId: "YOUR_USER_ID"
      });
    });

    s.on("disconnect", () => setConnected(false));

    return () => s.disconnect();
  }, []);

  return (
    <div style={{ padding: 12 }}>
      <h1>DnD Map (Multiplayer Prototype)</h1>
      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      {socket ? <MapCanvas socket={socket} /> : "Connecting..."}
    </div>
  );
}

export default App;
