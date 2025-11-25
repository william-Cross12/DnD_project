Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
npm -v


# requirements

Players:
Join the campaign of a DM
create a character (character creation and management section)
be able to select tools and draw on map when DM has interaction setting on
be able to move tokens that they are allowed to control


DM:
Create a campaign (they are automatically assigned as the DM)
View all campaign character sheets (and edit)
manage player permissions in interactive map
switch maps
save maps

<br />
<br />

## Campaign Management

| Method | Endpoint                    | Description                                | Request Body              | Notes                        |
| ------ | --------------------------- | ------------------------------------------ | ------------------------- | ---------------------------- |
| POST   | `/campaign/create-campaign` | Create a new campaign                      | `{ name: "My Campaign" }` | DM is automatically assigned |
| POST   | `/campaign/:id/invite`      | Create an invite token for a campaign      | none                      | Returns `{ token }`          |
| GET    | `/campaign/:id`             | Get campaign info (users, map, characters) | none                      | Useful for both DM & players |
| PUT    | `/campaign/:id/map`         | Switch/update the current map image        | `{ image: "url" }`        | DM only                      |

<br />
<br />

## Join

| Method | Endpoint | Description                | Request Body                           | Notes                                 |
| ------ | -------- | -------------------------- | -------------------------------------- | ------------------------------------- |
| POST   | `/join`  | Join a campaign via invite | `{ token: "...", name: "PlayerName" }` | Returns user object and campaign info |

<br />
<br />

## Character Management

| Method | Endpoint                          | Description                    | Request Body                            | Notes                                                |
| ------ | --------------------------------- | ------------------------------ | --------------------------------------- | ---------------------------------------------------- |
| POST   | `/characters`                     | Create a character             | `{ campaignId, playerId, name, sheet }` | Players create for themselves                        |
| GET    | `/characters/:campaignId`         | Get all characters in campaign | none                                    | DM can view all                                      |
| PUT    | `/characters/:campaignId/:charId` | Update a character             | `{ name, sheet }`                       | DM can edit any character, player can edit their own |

<br />
<br />

## Player Permissions

| Method | Endpoint                                 | Description                                | Request Body                                                    | Notes   |
| ------ | ---------------------------------------- | ------------------------------------------ | --------------------------------------------------------------- | ------- |
| PUT    | `/users/:campaignId/:userId/permissions` | Set player permissions for map interaction | `{ permissions: { draw: true/false, moveTokens: true/false } }` | DM only |

<br />
<br />

## Socket.io Events

| Event                                 | Description                      | Payload                   |
| ------------------------------------- | -------------------------------- | ------------------------- |
| `join-room`                           | Join a campaign room             | `{ campaignId, userId }`  |
| `draw-stroke`                         | Player draws a stroke on map     | `stroke` object           |
| `place-token`                         | Player places a token            | `token` object            |
| `move-token`                          | Player moves a token             | `{ tokenId, x, y }`       |
| `roll-dice`                           | Roll dice in campaign            | `{ formula, visibility }` |
| `state` (emitted)                     | Sends full map & users to client | `{ map, users }`          |
| `stroke` (emitted)                    | Broadcast a new stroke           | `stroke` object           |
| `token` (emitted)                     | Broadcast a new token            | `token` object            |
| `token-move` (emitted)                | Broadcast token movement         | `{ tokenId, x, y }`       |
| `dice-result` / `dice-result-private` | Broadcast dice results           | `result` object           |
