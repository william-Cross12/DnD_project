const mapSockets = require('./map');
const diceSockets = require('./dice');

module.exports = (io, socket) => {
  console.log('socket connected', socket.id);

  socket.on('join-room', data => mapSockets.joinRoom(io, socket, data));
  socket.on('draw-stroke', data => mapSockets.drawStroke(io, socket, data));
  socket.on('place-token', data => mapSockets.placeToken(io, socket, data));
  socket.on('move-token', data => mapSockets.moveToken(io, socket, data));
  socket.on('roll-dice', data => diceSockets.rollDice(io, socket, data));

  socket.on('disconnect', () => console.log('socket disconnected', socket.id));
};
