# BloodBridge

This archive contains your existing React frontend (project root) plus a new
`backend/` folder with the Node.js + Express + MongoDB (Mongoose) API.

## Layout

```
bloodbridge/
  src/, index.html, package.json, ...   ← your existing frontend, untouched
  backend/                              ← new: Express + Mongoose API
    server.js
    src/
    README.md                          ← full API reference & setup
    .env.example
```

## Quick start (backend)

```bash
cd backend
npm install
cp .env.example .env      # then fill in your own MONGO_URI, JWT_SECRET, etc.
npm run seed               # optional: adds 4 sample hospitals
npm run dev
```

The API runs at `http://localhost:5000`. See `backend/README.md` for the full route
list and data model reference — it covers auth (patient/hospital registration & login),
hospital listing/search/stock management, blood requests, notifications, contact
messages, and homepage stats.

## Quick start (frontend)

```bash
npm install
npm run dev
```

The frontend currently renders from local mock data in `src/lib/data.js` — it does not
yet call the API. To wire it up, point `fetch`/axios calls at
`http://localhost:5000/api/...` (or set `VITE_API_URL` and add a small API client) and
swap the static imports in `FindBlood.jsx`, `Hospitals.jsx`, `PatientDashboard.jsx`,
`HospitalDashboard.jsx`, `Login.jsx`, `Register.jsx`, and `Contact.jsx` for calls to the
matching endpoints described in `backend/README.md`.

## Credentials

No MongoDB credentials are stored anywhere in this project. Add your own MongoDB Atlas
connection string to `backend/.env` as `MONGO_URI` (see `backend/.env.example`) —
that file is git-ignored and never read by the code except through `process.env`.
