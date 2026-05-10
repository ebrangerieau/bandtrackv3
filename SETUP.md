# BandTrack — Setup

## Development (local)

### Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173 (proxies /api → :5000)
```

Register the first account → it becomes the group admin automatically.
The database is seeded with 18 songs, 5 gigs, and 5 activity items on first run.

---

## Production (Docker)

```bash
# Optional: set a strong secret key
export SECRET_KEY=your-secret-here

docker compose up --build -d
# App available at http://localhost
```

Data persists in the `bandtrack-data` Docker volume.

---

## Features

| Screen | What you can do |
|---|---|
| **Dashboard** | See next gig, stats, learning songs, activity feed |
| **Répertoire** | Browse songs by status, search, add new songs, tap to open detail |
| **Fiche morceau** | Drag slider to set your level, edit personal notes, edit group note, change status |
| **Prestations** | See upcoming/past gigs, add new performances |
| **Réglages** | Change group name, switch color palette (Violet / Rouge / Vert / Bleu), log out |

## Notes

- Audio memo playback is UI-only (no real audio upload in this version)
- All 4 color palettes are selectable in Réglages and persisted to localStorage
- On desktop the app appears as a phone frame (390×844); on mobile it fills the viewport
