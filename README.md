# CueFinder

Find nearby pool tables, save your favorites, and track head-to-head match history with friends.

**Live:** [cue-finder-acqq.vercel.app](https://cue-finder-acqq.vercel.app)

## Features

- Search for pool tables near an address or your current location (Google Maps Places API)
- Save/like tables to your profile
- Sign up / log in with email+password (JWT) or Google OAuth
- Record 1v1 match results and track win/loss history and head-to-head records
- Global leaderboard ranked by wins

## Tech stack

**Backend** — FastAPI, SQLAlchemy (Postgres via Neon), JWT + bcrypt auth, Authlib for Google OAuth, deployed on Railway.

**Frontend** — React 19 + TypeScript, Vite, React Router, deployed on Vercel.

## Local setup

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your own values
uvicorn app.main:app --reload
```

Requires a Postgres database (e.g. a free [Neon](https://neon.tech) instance) and a Google Cloud project with the Maps/Places API and an OAuth 2.0 client enabled.

### Frontend

```bash
cd cueFinder
npm install
cp .env.example .env.development   # or .env.local
npm run dev
```

## Testing

```bash
cd backend
pytest
```
