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

## Production — VPS + Traefik

Prérequis : Traefik déjà en place avec un réseau Docker `web` externe et un certresolver `letsencrypt`.

```bash
# Sur le VPS, cloner le repo
git clone https://github.com/ebrangerieau/bandtrackv3.git bandtrack
cd bandtrack

# Définir une clé secrète forte
export SECRET_KEY=$(openssl rand -hex 32)

# Lancer
docker compose up --build -d
```

L'app sera disponible sur **https://bandtrack.fr** et **https://www.bandtrack.fr**  
(TLS automatique via Let's Encrypt, certificat géré par Traefik).

Les données persistent dans le volume Docker `bandtrack-data`.

### Mise à jour

```bash
git pull
docker compose up --build -d
```

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
