# BloodBridge — Backend

Node.js + Express + MongoDB (Mongoose) API for the BloodBridge React frontend.

## Setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and set your own values:

```
MONGO_URI=<your MongoDB Atlas connection string>
PORT=5000
JWT_SECRET=<a long random string>
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```

**Never commit `.env`.** It's already listed in `.gitignore`. The server refuses to start
if `MONGO_URI` is missing — it never falls back to a hardcoded connection string.

Run it:

```bash
npm run dev      # auto-restarts on file changes (node --watch)
npm start        # plain start
npm run seed     # optional: populate 4 sample hospitals matching the frontend's demo data
```

The API listens on `http://localhost:5000` by default. Health check: `GET /api/health`.

## Project structure

```
backend/
  server.js                 # entry point: loads .env, connects Mongo, starts Express
  src/
    config/db.js             # Mongoose connection (reads MONGO_URI)
    models/                  # User, Hospital, BloodRequest, Notification, ContactMessage
    middleware/auth.js       # JWT protect() + role-based authorize()
    middleware/errorHandler.js
    controllers/             # route handler logic
    routes/                  # Express routers, mounted under /api/*
    utils/generateToken.js
    utils/seed.js            # optional sample-data seeder
```

## Data models

- **User** — `name, email, password (hashed), role (patient|hospital|admin), phone, bloodGroup, hospital (ref)`
- **Hospital** — `name, owner (ref User), address, city, phone, email, rating, verified, location (GeoJSON Point), stock { A+, A-, B+, B-, AB+, AB-, O+, O- }`
- **BloodRequest** — `patient (ref), hospital (ref), bloodGroup, units, urgency, notes, status`
- **Notification** — `user (ref), hospital (ref), text, tone, read`
- **ContactMessage** — `name, email, subject, message, resolved`

## API reference

All JSON. Protected routes require `Authorization: Bearer <token>` (returned from register/login).

### Auth — `/api/auth`
| Method | Route | Access | Notes |
|---|---|---|---|
| POST | `/register` | Public | `{ name, email, password, role: 'patient'\|'hospital', phone?, bloodGroup?, hospitalDetails? }`. Registering as `hospital` auto-creates a linked Hospital record. |
| POST | `/login` | Public | `{ email, password }` |
| GET | `/me` | Private | Current user profile |
| PUT | `/me` | Private | Update `name, phone, bloodGroup` |

### Hospitals — `/api/hospitals`
| Method | Route | Access | Notes |
|---|---|---|---|
| GET | `/` | Public | Query: `q` (name/address search), `bloodGroup`, `maxDistanceKm`, `lat`, `lng`, `verifiedOnly`. Matches the FindBlood / Hospitals pages' filter+sort behavior. |
| GET | `/:id` | Public | Single hospital |
| POST | `/` | Private (hospital, admin) | Create a hospital |
| PUT | `/:id` | Private (owner, admin) | Update details |
| DELETE | `/:id` | Private (owner, admin) | Delete |
| PATCH | `/:id/stock` | Private (owner, admin) | `{ mode: 'delta'\|'set', changes: { "O+": 1, "A-": -1 } }`. Powers the +/- and Clear buttons on the Hospital Dashboard. Auto-creates a low-stock notification when any group drops under 5. |

### Requests — `/api/requests`
| Method | Route | Access | Notes |
|---|---|---|---|
| POST | `/` | Private (patient) | `{ hospital, bloodGroup, units?, urgency?, notes? }` |
| GET | `/mine` | Private (patient) | Patient's own request history |
| GET | `/hospital` | Private (hospital, admin) | Requests received by the logged-in hospital |
| PATCH | `/:id/status` | Private | `{ status: 'accepted'\|'rejected'\|'fulfilled'\|'cancelled' }`. Fulfilling decrements hospital stock automatically. |

### Notifications — `/api/notifications`
| Method | Route | Access |
|---|---|---|
| GET | `/` | Private — returns the user's + their hospital's notifications |
| PATCH | `/:id/read` | Private |

### Contact — `/api/contact`
| Method | Route | Access |
|---|---|---|
| POST | `/` | Public — `{ name, email, subject?, message }`, backs the Contact page form |

### Stats — `/api/stats`
| Method | Route | Access |
|---|---|---|
| GET | `/` | Public — live counters for the homepage (hospitals connected, units available, donations, lives saved) |

## Security notes

- Passwords are hashed with bcrypt before saving; the hash is `select: false` by default.
- Auth uses stateless JWTs (`Authorization: Bearer <token>`), verified in `middleware/auth.js`.
- `helmet`, CORS allow-listing (`CLIENT_ORIGIN`), and a global rate limiter are enabled in `src/app.js`.
- All Mongo credentials come only from `MONGO_URI` in your local `.env` — the code never reads,
  requests, or hardcodes them anywhere.
