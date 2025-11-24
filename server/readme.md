# DnD App Server Documentation

## Overview

This server uses Express and Socket.io to manage DnD campaigns, including creating campaigns, inviting users, joining campaigns, and real-time map interaction (drawing strokes, placing and moving tokens, rolling dice). Data is persisted in a simple JSON file.

## Dependencies

* express: HTTP server framework
* http: Node's HTTP module to wrap Express
* socket.io: Real-time websocket communication
* cors: Enable cross-origin requests
* nanoid: Generate unique IDs
* fs: File system access
* path: Path utilities
* express-rate-limit: Request rate limiting

## Database

* DB_FILE: `db.json` for persistent storage
* Structure:

  ```json
  {
    "campaigns": {},
    "invites": {}
  }
  ```
* `persist()`: Writes the current DB state to `db.json`.

## Express Setup

* Middleware:

  * cors(): Allow cross-origin requests
  * express.json(): Parse JSON request bodies
  * rateLimit(): Limit to 200 requests per 15 minutes

## HTTP Endpoints

### POST /create-campaign

* Create a new campaign
* Request body: `{ name: string }` (optional)
* Generates unique campaign ID
* Returns `{ id: string }`
* Initializes campaign state:

  * gmId: null
  * users: {}
  * map: { image: null, strokes: [], tokens: [] }

### POST /campaign/:id/invite

* Create invite token for a campaign
* Generates unique 10-character token
* Expires after 24 hours
* Returns `{ token: string }`

### POST /join

* Join a campaign via invite token
* Request body: `{ token: string, name: string }`
* Validates invite token and expiry
* Adds user to campaign:

  * First user = GM
  * Subsequent users = Player
* Returns `{ user, campaign }`

### GET /campaign/:id

* Get basic campaign state
* Returns campaign object including users and map

## Socket.io Events

### Connection

* Logs socket connection
* All socket communication is real-time

### join-room

* Join a campaign room
* Payload: `{ campaignId, userId }`
* Checks if campaign and user exist
* Stores mapping in socket.data
* Sends current map state: { map, users }

### draw-stroke

* Draw a stroke on map
* Payload: stroke object
* Permission: non-spectator users
* Attaches id and author to stroke
* Broadcasts stroke event to campaign room
* Persists to DB

### place-token

* Place a token on map
* Payload: token object
* Attaches id and author
* Broadcasts token event to campaign room
* Persists to DB

### move-token

* Move a token on map
* Payload: { tokenId, x, y }
* Permission: only author or GM
* Updates token coordinates
* Broadcasts token-move event
* Persists to DB

### roll-dice

* Roll dice with formula and visibility
* Payload: { formula, visibility }
* Parses NdM+K formulas
* Generates random results
* Visibility:

  * private: only requester + GM
  * public: all clients in room
* Broadcasts results as dice-result-private or dice-result

### disconnect

* Logs socket disconnection

## Server Startup

* Listens on process.env.PORT || 4000
* Logs Server listening on <PORT>
