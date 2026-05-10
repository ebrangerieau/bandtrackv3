# BandTrack – Cahier des charges version 3

---

## 1 – Contexte et objectifs

BandTrack est une application web progressive (PWA) destinée aux petits groupes de musique (2 à 4 membres) pour gérer leur répertoire, suivre la progression de chaque morceau et organiser leurs prestations.

La version 3 s'appuie sur l'architecture centralisée introduite en v2 (backend Python, API REST, SQLite, Docker) et y apporte trois évolutions majeures :

- Un **cycle de vie explicite** des morceaux, de la suggestion à l'archivage.
- Une **expérience mobile-first simplifiée**, adaptée à des utilisateurs peu à l'aise avec la technologie.
- Des **fonctionnalités collaboratives légères** : note collective, notifications, tableau de bord.

### Périmètre v3 — ce qui est inclus

- Cycle de vie complet des morceaux (4 statuts)
- Tableau de bord d'accueil
- Niveaux individuels + moyenne groupe
- Prestations enrichies avec setlist ordonnée et export PDF
- Note collective unique par morceau
- Notifications internes sur les événements clés

### Ce qui est exclu (reporté à une version ultérieure)

- Multi-groupes sur une même instance
- Synchronisation temps réel (WebSocket)
- Lecteur audio universel (Spotify/YouTube intégré)
- Export CSV du répertoire complet

---

## 2 – Architecture générale

Identique à la v2 :

- **SPA / PWA** : interface HTML/CSS/JS installable, interactions via API REST.
- **Backend Python** (Python 3.11-slim, Docker) : API `/api/...`, base SQLite, sessions via cookies HttpOnly + SameSite=Lax.
- **Volume Docker** `bandtrack-data` : conserve `bandtrack.db` et les fichiers audio.
- **Déploiement** : Dockerfile + docker-compose.yml, compatible NAS ou serveur personnel.

---

## 3 – Authentification et gestion des utilisateurs

Inchangée par rapport à la v2 :

- Inscription avec nom d'utilisateur et mot de passe (PBKDF2-SHA256 + sel aléatoire).
- Premier compte créé = administrateur par défaut.
- Sessions côté serveur, expiration après une semaine ou à la déconnexion.
- Rôles : membre / administrateur. Les admins gèrent les rôles des autres (pas du leur).
- Paramètres du profil : nom du groupe, mode sombre/clair.

### Suppression de compte

Lorsqu'un administrateur supprime un compte utilisateur, toutes les données personnelles associées sont effacées : niveaux, notes textuelles, notes audio. Les morceaux et suggestions créés par cet utilisateur sont conservés mais désattribués (auteur affiché comme « Membre supprimé »).

---

## 4 – Répertoire (section centrale de l'application)

### 4.1 Cycle de vie d'un morceau

Chaque morceau possède un **statut** parmi les quatre suivants :

| Statut | Description |
|---|---|
| **Suggestion** | Idée proposée par un membre, pas encore travaillée |
| **En apprentissage** | Morceau activement travaillé en répétition |
| **Prêt à jouer** | Morceau maîtrisé, jouable en concert |
| **Archivé** | Morceau retiré du répertoire actif |

**Règles de transition :**
- N'importe quel membre connecté peut changer le statut d'un morceau.
- Chaque changement de statut génère une notification pour tous les membres.
- Un morceau archivé reste consultable mais n'apparaît pas dans les listes actives par défaut.

### 4.2 Fiche morceau

Chaque morceau comprend :

- Titre (obligatoire)
- Auteur (optionnel)
- Lien YouTube (optionnel)
- Lien Spotify (optionnel)
- Statut (obligatoire, modifiable par tous)
- Date de création et créateur

**Données personnelles (par membre) :**
- Niveau de maîtrise : curseur 0–10 (0 = je ne connais pas, 10 = je maîtrise parfaitement). La valeur est enregistrée immédiatement. Le curseur se colore selon le niveau.
- Notes textuelles personnelles.
- Note audio personnelle (mp3/wav, max 5 Mo).

**Données collectives :**
- Moyenne des niveaux du groupe, affichée sous forme de barre de progression colorée sur la carte.
- Note collective unique : un champ texte partagé par tous les membres, modifiable par n'importe qui. L'auteur de la dernière modification et l'horodatage sont affichés.
- Niveaux individuels des autres membres (affichés par pseudo, insensible à la casse).

### 4.3 Affichage du répertoire

La page Répertoire affiche les morceaux regroupés par statut :

1. **En apprentissage** (affiché en premier)
2. **Prêt à jouer**
3. **Suggestion**
4. **Archivé** (masqué par défaut, affichable via un bouton « Afficher les archivés »)

Chaque carte affiche : titre, auteur, statut, moyenne groupe, liens disponibles.

### 4.4 Ajout et modification

- Tout membre peut ajouter un morceau (statut initial au choix).
- Le créateur ou un administrateur peut modifier le titre, l'auteur et les liens.
- Le créateur ou un administrateur peut supprimer un morceau (confirmation requise).
- Tout membre peut modifier le statut, son niveau personnel, ses notes et sa note audio.

---

## 5 – Prestations

### 5.1 Fiche prestation

Une prestation comprend :

- Nom (obligatoire)
- Date (obligatoire)
- Lieu (optionnel)
- Contact organisateur (optionnel)
- Cachet (optionnel)
- Durée du set en minutes (optionnel)
- Setlist : liste ordonnée de morceaux sélectionnés parmi les morceaux au statut « Prêt à jouer » ou « En apprentissage »

### 5.2 Setlist ordonnée

Les morceaux d'une prestation sont affichés dans un ordre défini. Cet ordre est modifiable par le créateur ou un administrateur via un mécanisme de réordonnancement (glisser-déposer sur mobile, boutons haut/bas en alternative accessible).

### 5.3 Affichage des prestations

La page Prestations est divisée en deux sections : **À venir** et **Passées**, triées par date.

Chaque carte est cliquable et ouvre une vue détaillée affichant :
- Les informations pratiques de la prestation.
- La setlist ordonnée, avec titre et auteur de chaque morceau.
- Chaque morceau de la setlist est cliquable pour accéder à sa fiche complète.

### 5.4 Export PDF de la setlist

Depuis la vue détaillée d'une prestation, un bouton « Exporter la setlist en PDF » génère un document contenant :
- Nom de la prestation, date, lieu.
- Liste ordonnée des morceaux (numéro, titre, auteur).

### 5.5 Modification et suppression

Le créateur ou un administrateur peut modifier ou supprimer une prestation. Toute suppression est précédée d'une confirmation.

---

## 6 – Tableau de bord (écran d'accueil)

Après connexion, l'utilisateur arrive sur un tableau de bord affichant :

- **Prochaine prestation** : nom, date, lieu, nombre de morceaux. Cliquable vers le détail.
- **Morceaux en cours** : nombre de morceaux au statut « En apprentissage », avec les 3 derniers ajoutés ou modifiés.
- **Activité récente** : fil des 5 dernières actions du groupe (changement de statut, ajout de morceau, nouvelle prestation), avec auteur et horodatage.
- **Notifications non lues** : badge ou liste des notifications en attente.

---

## 7 – Notifications

### Événements déclencheurs

Une notification est générée pour tous les membres (sauf l'auteur de l'action) dans les cas suivants :

| Événement | Message |
|---|---|
| Morceau ajouté | « [Membre] a ajouté *[Titre]* au répertoire »  |
| Statut modifié | « [Membre] a passé *[Titre]* en [Statut] » |
| Prestation ajoutée | « [Membre] a créé la prestation *[Nom]* le [Date] » |
| Prestation modifiée | « [Membre] a modifié la prestation *[Nom]* » |

### Affichage

- Les notifications sont accessibles depuis le tableau de bord et via une icône dans la barre de navigation.
- Une notification peut être marquée comme lue. Un badge indique le nombre de notifications non lues.
- Les notifications sont conservées 30 jours puis supprimées automatiquement.

---

## 8 – Navigation et ergonomie

### 8.1 Navigation principale

Barre fixe en bas de l'écran (mobile-first), 4 onglets :

| Icône | Label | Contenu |
|---|---|---|
| 🏠 | Accueil | Tableau de bord |
| 🎵 | Répertoire | Morceaux par statut |
| 🎤 | Prestations | À venir / Passées |
| ⚙️ | Paramètres | Profil, groupe, comptes |

Un badge de notification est affiché sur l'icône Accueil si des notifications non lues existent.

### 8.2 Principes ergonomiques (mobile-first)

- Toutes les actions principales sont accessibles en un ou deux taps.
- Les formulaires d'ajout et de modification s'ouvrent dans des modales plein écran sur mobile.
- Les actions destructives (suppression) sont toujours précédées d'une confirmation explicite.
- Le réordonnancement de la setlist supporte le glisser-déposer tactile, avec des boutons ↑/↓ en alternative.
- Les champs de formulaire sont tous étiquetés (accessibilité).
- Les liens externes s'ouvrent dans un nouvel onglet (`target="_blank"`).
- Le mode sombre est géré au niveau du groupe (paramètre partagé).

---

## 9 – Sécurité et conformité

- **Mots de passe** : hachage PBKDF2-SHA256 avec sel aléatoire par utilisateur.
- **Sessions** : stockées côté serveur, transmises via cookies HttpOnly + SameSite=Lax. Expiration à 7 jours.
- **Validation des entrées** : le backend valide systématiquement longueurs, formats d'URL, types de fichiers et dates.
- **Fichiers audio** : limités à 5 Mo, stockés en base sous forme de Data URL.
- **Suppression de compte** : toutes les données personnelles associées sont effacées.
- **Durée de conservation des notifications** : 30 jours, suppression automatique.

> **Note RGPD** : BandTrack collecte des données personnelles (pseudos, enregistrements audio associés à des personnes). Dans le cadre d'un usage strictement privé sur instance auto-hébergée, l'application relève d'un usage domestique exempté du RGPD. Si l'instance venait à être ouverte à d'autres groupes, une politique de confidentialité et une procédure de demande d'effacement devront être formalisées.

---

## 10 – Contraintes techniques

Identiques à la v2, avec les ajouts suivants :

- **Export PDF** : généré côté serveur (bibliothèque Python, ex. WeasyPrint ou ReportLab) ou côté client (ex. jsPDF). La solution retenue doit fonctionner sans dépendance externe réseau.
- **Notifications** : stockées en base SQLite dans une table dédiée (`notifications`), lues par polling HTTP régulier (toutes les 60 secondes). Pas de WebSocket en v3.
- **Réordonnancement setlist** : l'ordre est stocké sous forme d'un champ `position` (entier) sur la table de liaison `prestation_morceaux`.

---

## 11 – Modèle de données (entités principales)

| Entité | Champs clés |
|---|---|
| `users` | id, username, password_hash, is_admin, created_at |
| `morceaux` | id, titre, auteur, youtube_url, spotify_url, statut, note_collective, note_collective_auteur_id, note_collective_updated_at, created_by, created_at |
| `niveaux` | id, morceau_id, user_id, valeur, updated_at |
| `notes_personnelles` | id, morceau_id, user_id, texte, audio_data, updated_at |
| `prestations` | id, nom, date, lieu, contact, cachet, duree_set, created_by, created_at |
| `prestation_morceaux` | id, prestation_id, morceau_id, position |
| `notifications` | id, user_id, message, lu, created_at |
| `settings` | key, value (nom_groupe, mode_sombre) |

---

## 12 – Évolutions possibles (v4+)

| Priorité | Évolution |
|---|---|
| 🟠 Haute | Multi-groupes sur une même instance (isolation des données par groupe) |
| 🟠 Haute | Historique des niveaux personnels (courbe de progression) |
| 🟡 Moyenne | Synchronisation temps réel via WebSocket |
| 🟡 Moyenne | Export CSV du répertoire complet |
| 🔵 Basse | Lecteur audio universel (intégration YouTube/Spotify) |
| 🔵 Basse | Mode répétition (vue dédiée plein écran pour la session) |
| 🔵 Basse | Vote collectif pour valider le passage d'un morceau à un statut supérieur |

---

*BandTrack v3 — Cahier des charges rédigé sur la base des retours utilisateurs et de l'analyse critique de la v2.*
