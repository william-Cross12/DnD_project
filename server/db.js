const fs = require('fs');
const path = require('path');

const DB_FILE = path.resolve(__dirname, 'db.json');
let DB = { campaigns: {}, invites: {} };

if (fs.existsSync(DB_FILE)) {
  try { DB = JSON.parse(fs.readFileSync(DB_FILE)); } 
  catch(e) { console.error('db load error', e); }
}

function persist() {
  fs.writeFileSync(DB_FILE, JSON.stringify(DB, null, 2));
}

module.exports = { DB, persist };
