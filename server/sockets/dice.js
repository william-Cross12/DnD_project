const { nanoid } = require('nanoid');
const { DB } = require('../db');

function rollDice(io, socket, { formula, visibility }) {
  function rollOnce(sides) { return Math.floor(Math.random() * sides) + 1; }

  const m = (formula || '1d20').match(/(\d+)d(\d+)([+-]\d+)?/);
  let result = { formula, rolls: [], total: 0 };

  if (m) {
    const n = parseInt(m[1]);
    const sides = parseInt(m[2]);
    const mod = m[3] ? parseInt(m[3]) : 0;
    for (let i = 0; i < n; i++) {
      const r = rollOnce(sides);
      result.rolls.push(r);
      result.total += r;
    }
    result.total += mod;
  }

  result.id = nanoid(8);
  result.author = socket.data.userId;

  const campaignId = socket.data.campaignId;
  if (!campaignId) return;

  if (visibility === 'private') {
    const camp = DB.campaigns[campaignId];
    socket.emit('dice-result-private', result); // requester
    io.in('camp:' + campaignId).fetchSockets().then(sockets => {
      sockets.forEach(s => {
        const uid = s.data.userId;
        if (!uid) return;
        const u = camp.users[uid];
        if (u && u.role === 'gm') s.emit('dice-result-private', result);
      });
    });
  } else {
    io.to('camp:' + campaignId).emit('dice-result', result);
  }
}

module.exports = { rollDice };
