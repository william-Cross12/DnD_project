import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import MapCanvas from "./MapCanvas";
import ToolBar from "./components/ToolBar";
import { useToolState } from "./hooks/useToolState";

const SERVER_URL = "http://localhost:4000";

function App() {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const toolState = useToolState();

  useEffect(() => {
    const s = io(SERVER_URL, { autoConnect: true });
    setSocket(s);

    s.on("connect", () => {
      setConnected(true);

      // TEMP — put your real campaignId/userId here if testing with server
      // these placeholders just avoid throwing on connect
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

      <ToolBar
        tool={toolState.tool}
        setTool={toolState.setTool}
        color={toolState.color}
        setColor={toolState.setColor}
      />

      {socket ? (
        <MapCanvas
          socket={socket}
          tool={toolState.tool}
          color={toolState.color}
          lineWidth={toolState.lineWidth}
        />
      ) : (
        "Connecting..."
      )}
    </div>
  );
}

export default App;
