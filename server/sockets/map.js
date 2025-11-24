const { nanoid } = require('nanoid');
const { DB, persist } = require('../db');

function joinRoom(io, socket, { campaignId, userId }) {
  const camp = DB.campaigns[campaignId];
  if (!camp) { socket.emit('error', 'no campaign'); return; }
  if (!camp.users[userId]) { socket.emit('error', 'not a member'); return; }

  socket.join('camp:' + campaignId);
  socket.data.campaignId = campaignId;
  socket.data.userId = userId;

  socket.emit('state', { map: camp.map, users: camp.users });
}

function drawStroke(io, socket, stroke) {
  const campaignId = socket.data.campaignId;
  if (!campaignId) return;
  const camp = DB.campaigns[campaignId];

  const user = camp.users[socket.data.userId];
  if (!user || user.role === 'spectator' || !user.permissions?.draw) return;

  stroke.id = nanoid(10);
  stroke.author = user.id;
  camp.map.strokes.push(stroke);

  io.to('camp:' + campaignId).emit('stroke', stroke);
  persist();
}

function placeToken(io, socket, token) {
  const campaignId = socket.data.campaignId;
  if (!campaignId) return;
  const camp = DB.campaigns[campaignId];
  const user = camp.users[socket.data.userId];
  if (!user || !user.permissions?.moveTokens) return;

  token.id = nanoid(8);
  token.author = user.id;
  camp.map.tokens.push(token);

  io.to('camp:' + campaignId).emit('token', token);
  persist();
}

function moveToken(io, socket, { tokenId, x, y }) {
  const campaignId = socket.data.campaignId;
  if (!campaignId) return;
  const camp = DB.campaigns[campaignId];
  const token = camp.map.tokens.find(t => t.id === tokenId);
  if (!token) return;

  const user = camp.users[socket.data.userId];
  if (!user) return;
  if (token.author !== user.id && user.role !== 'gm') return;

  token.x = x;
  token.y = y;

  io.to('camp:' + campaignId).emit('token-move', { tokenId, x, y });
  persist();
}

module.exports = { joinRoom, drawStroke, placeToken, moveToken };
