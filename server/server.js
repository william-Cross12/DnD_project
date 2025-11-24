// Core dependencies
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// JSON DB helper
const { DB, persist } = require('./db');

// Routes
const campaignRoutes = require('./routes/campaigns');
const joinRoutes = require('./routes/join');
const characterRoutes = require('./routes/characters');
const userRoutes = require('./routes/users');

// Socket handlers
const socketHandler = require('./sockets');

// -------------------------
// Express setup
// -------------------------
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());
app.use(express.json());
app.use(rateLimit({ windowMs: 15*60*1000, max: 200 }));

// -------------------------
// Routes
// -------------------------
app.use('/campaign', campaignRoutes);  // e.g., create campaign, invite, map management
app.use('/join', joinRoutes);          // join campaign
app.use('/characters', characterRoutes); // character creation & management
app.use('/users', userRoutes);         // manage player permissions

// -------------------------
// Socket.io real-time
// -------------------------
io.on('connection', socket => socketHandler(io, socket));

// -------------------------
// Start server
// -------------------------
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log('Server listening on', PORT));
