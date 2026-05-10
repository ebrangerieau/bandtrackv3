# Animations pages

_Started 2026-05-10 13:07 UTC_

---

## User



## Assistant

_[tool: read_file]_

_[tool: update_todos]_

_[tool: copy_starter_component]_

_[tool: copy_starter_component]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: snip]_

_[tool: write_file]_

I have everything I need. Stating the design system before I build:

**Aesthetic**: "Stage Energy" — dark, expressive, soft halos. Plus Jakarta Sans throughout (700/600/500/400). Cards = surface fill + subtle accent-tinted border, no heavy shadows. Hero blocks get a soft accent gradient and a glow ring. Tab bar floats with backdrop-blur. 200ms transitions.

**4 palettes** as Tweaks: Nuit violette, Scène rouge, Studio vert, Scène bleue.

**Statuses share tokens** across palettes (amber/indigo/green/gray).

Building now — splitting into theme, ui, four screen files, and an app entrypoint.

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: snip]_

_[tool: write_file]_

_[tool: write_file]_

_[tool: snip]_

_[tool: done]_

_[tool: fork_verifier_agent]_

**BandTrack — Stage Energy** is ready: 4 mobile screens (390×844) on a design canvas, with 4 palette options exposed via Tweaks.

- **01 Tableau de bord** — header avatar/groupe, hero "Prochain concert" avec gradient + glow, 3 pills statistiques, scroller "Morceaux en cours", flux d'activité, tab bar floutée
- **02 Répertoire** — 4 onglets pills par statut (En cours / Prêts / Idées / Archivés), barre de recherche, cartes compactes avec barre de progression colorée
- **03 Fiche morceau** — niveau du groupe (rouge→vert), grand score 56px, slider custom avec halo, notes perso "carnet" + mémo audio, note collective cyan, grille statuts 2×2
- **04 Prestations** — segment À venir/Passées, cartes avec date block, indicateur de complétude

Tweaks panel : switch entre Nuit violette · Scène rouge · Studio vert · Scène bleue.

Le slider et les onglets répertoire/prestations sont interactifs.

## User

c'est bien mais est-il possible d'apporter des animations visuelle dans les différentes pages

## Assistant

_[tool: snip]_

_[tool: str_replace_edit]_

_[tool: snip]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: grep]_

_[tool: list_files]_

_[tool: snip]_

_[tool: grep]_

_[tool: update_todos]_

_[tool: done]_

_[tool: update_todos]_

_[tool: fork_verifier_agent]_

_[tool: snip]_

Animations livrées sur les 4 écrans :

- **Orbe lumineux** qui flotte derrière le hero du tableau de bord
- **Texte ▶ scintillant** sur les pastilles "Prochain concert"
- **Stats / cartes / activité** qui apparaissent en cascade (`bt-stagger`)
- **Barres de progression** qui se déploient (`bt-bar-grow`)
- **Pastilles de statut** qui pulsent (`bt-dot-pulse`) + badge notif qui glow
- **Slider de la fiche morceau** : halo respirant autour du thumb, score 0–10 qui re-fade-up à chaque changement
- **Mémo audio** : equalizer animé pendant la lecture, bouton play en glow-pulse

Toutes les animations sont déclaratives via les classes `bt-*` de la feuille de style globale, donc trivialement désactivables si tu veux un mode "calme".

