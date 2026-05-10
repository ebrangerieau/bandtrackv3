import os
import sqlite3
import hashlib
import secrets
import hmac
from datetime import datetime, date, timezone, timedelta
from functools import wraps
from flask import Flask, request, session, jsonify, g
from flask_cors import CORS

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', secrets.token_hex(32))
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

DB_PATH = os.environ.get('DB_PATH', 'bandtrack.db')

CORS(app,
     origins=os.environ.get('CORS_ORIGINS', 'http://localhost:5173').split(','),
     supports_credentials=True)

FRENCH_MONTHS = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin',
                 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']
FRENCH_WEEKDAYS = ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.']

SCHEMA = """
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    color TEXT DEFAULT NULL,
    is_admin INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'suggestion',
    created_by INTEGER,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS song_levels (
    song_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    level INTEGER NOT NULL DEFAULT 0,
    updated_at TEXT NOT NULL,
    PRIMARY KEY (song_id, user_id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS personal_notes (
    song_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    notes TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL,
    PRIMARY KEY (song_id, user_id),
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS collective_notes (
    song_id INTEGER NOT NULL PRIMARY KEY,
    author_id INTEGER,
    text TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS gigs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    date TEXT NOT NULL,
    place TEXT NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60,
    setlist_count INTEGER NOT NULL DEFAULT 0,
    ready_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS activity (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT,
    action_type TEXT NOT NULL,
    description TEXT NOT NULL,
    status_type TEXT,
    target_type TEXT,
    target_id INTEGER,
    created_at TEXT NOT NULL
);
"""

SEED_SONGS = [
    ('Black Hole Sun',          'Soundgarden',        'learning'),
    ('Wicked Game',             'Chris Isaak',        'learning'),
    ('Karma Police',            'Radiohead',          'learning'),
    ('Plug In Baby',            'Muse',               'learning'),
    ('Dreams',                  'Fleetwood Mac',      'learning'),
    ('Smells Like Teen Spirit', 'Nirvana',            'learning'),
    ('Seven Nation Army',       'The White Stripes',  'ready'),
    ('Mr. Brightside',          'The Killers',        'ready'),
    ('Take Me Out',             'Franz Ferdinand',    'ready'),
    ('Use Somebody',            'Kings of Leon',      'ready'),
    ('Pumped Up Kicks',         'Foster the People',  'ready'),
    ('Lonely Boy',              'The Black Keys',     'ready'),
    ('Creep',                   'Radiohead',          'ready'),
    ('All My Loving',           'The Beatles',        'ready'),
    ('Reptilia',                'The Strokes',        'suggestion'),
    ("Do I Wanna Know?",        'Arctic Monkeys',     'suggestion'),
    ('Heart-Shaped Box',        'Nirvana',            'suggestion'),
    ('Hotel California',        'Eagles',             'archived'),
]

SEED_GIGS = [
    ('La Cantine du Faubourg',   '2026-05-22', 'Lyon · Croix-Rousse',   75, 12, 9),
    ('Festival des Voûtes',      '2026-06-14', 'Villeurbanne',           90, 14, 8),
    ('Open Stage Le Sirius',     '2026-07-04', 'Lyon · Confluence',      60, 10, 6),
    ('Anniv. surprise Camille',  '2026-04-12', 'Vaulx-en-Velin',         90, 14, 14),
    ('Café Le Rhinocéros',       '2026-03-01', 'Lyon · Guillotière',     60, 11, 11),
]

SEED_ACTIVITY = [
    ('Léa',  'status', 'a passé Karma Police en En apprentissage', 'learning',   'song', 3, timedelta(hours=2)),
    ('Sami', 'add',    "a ajouté Reptilia aux idées",              'suggestion', 'song', 15, timedelta(days=1)),
    ('Inès', 'status', 'a marqué Take Me Out comme Prêt à jouer', 'ready',      'song', 9, timedelta(days=2)),
    ('Marc', 'gig',    'a créé la prestation La Cantine',          'accent',     'gig',  1, timedelta(days=3)),
    ('Léa',  'note',   'a modifié la note de Wicked Game',         'accent3',    'song', 2, timedelta(days=4)),
]


# ── DB helpers ────────────────────────────────────────────────────────────────

def get_db():
    if 'db' not in g:
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
        g.db.execute('PRAGMA foreign_keys = ON')
    return g.db

@app.teardown_appcontext
def close_db(e=None):
    db = g.pop('db', None)
    if db:
        db.close()

def init_db():
    data_dir = os.path.dirname(DB_PATH)
    if data_dir:
        os.makedirs(data_dir, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(SCHEMA)
    conn.commit()

    # Seed only when empty
    if conn.execute('SELECT 1 FROM songs LIMIT 1').fetchone():
        conn.close()
        return

    n = datetime.now(timezone.utc).isoformat()
    conn.execute("INSERT OR IGNORE INTO settings VALUES ('group_name', 'Les Échos du Lundi')")

    for title, author, status in SEED_SONGS:
        conn.execute(
            'INSERT INTO songs (title, author, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
            (title, author, status, n, n),
        )

    conn.execute(
        "INSERT INTO collective_notes (song_id, text, updated_at) VALUES (1, ?, ?)",
        ("Intro à la guitare puis batterie qui rentre au refrain. On ralentit le pont — arrangement vocal à définir.", n),
    )

    for name, gig_date, place, duration, sc, rc in SEED_GIGS:
        conn.execute(
            'INSERT INTO gigs (name, date, place, duration, setlist_count, ready_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (name, gig_date, place, duration, sc, rc, n),
        )

    for user_name, action_type, description, status_type, target_type, target_id, delta in SEED_ACTIVITY:
        dt = (datetime.now(timezone.utc) - delta).isoformat()
        conn.execute(
            'INSERT INTO activity (user_name, action_type, description, status_type, target_type, target_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (user_name, action_type, description, status_type, target_type, target_id, dt),
        )

    conn.commit()
    conn.close()


# ── Util ──────────────────────────────────────────────────────────────────────

def now_iso():
    return datetime.now(timezone.utc).isoformat()

def hash_password(password, salt=None):
    if salt is None:
        salt = secrets.token_hex(16)
    h = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt.encode('utf-8'), 260_000)
    return h.hex(), salt

def verify_password(password, password_hash, salt):
    h, _ = hash_password(password, salt)
    return hmac.compare_digest(h, password_hash)

def time_ago(dt_str):
    try:
        dt = datetime.fromisoformat(dt_str.replace('Z', '+00:00'))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        s = int((datetime.now(timezone.utc) - dt).total_seconds())
        if s < 60:    return "à l'instant"
        if s < 3600:  return f"il y a {s // 60} min"
        if s < 86400: return f"il y a {s // 3600} h"
        if s < 172800: return "hier"
        if s < 604800: return f"il y a {s // 86400} j"
        return f"il y a {s // 604800} sem"
    except Exception:
        return ""

def format_date_fr(date_str):
    try:
        d = date.fromisoformat(date_str)
        dday = (d - date.today()).days
        display = f"{d.day} {FRENCH_MONTHS[d.month - 1]}"
        weekday = FRENCH_WEEKDAYS[d.weekday()]
        return {'display': display, 'weekday': weekday, 'dday': dday}
    except Exception:
        return {'display': date_str, 'weekday': '', 'dday': 0}

def _status_label(status):
    return {'suggestion': 'Idées', 'learning': 'En apprentissage',
            'ready': 'Prêt à jouer', 'archived': 'Archivés'}.get(status, status)

def require_auth(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Non authentifié'}), 401
        return f(*args, **kwargs)
    return wrapper

def current_user():
    return session.get('user_id'), session.get('user_name')

def song_to_dict(row, db, user_id, full=False):
    s = dict(row)
    levels_rows = db.execute(
        'SELECT u.name, sl.level FROM song_levels sl JOIN users u ON sl.user_id = u.id WHERE sl.song_id = ?',
        (s['id'],),
    ).fetchall()
    levels = {r['name']: r['level'] for r in levels_rows}
    my_level = 0
    if user_id:
        ml = db.execute('SELECT level FROM song_levels WHERE song_id = ? AND user_id = ?', (s['id'], user_id)).fetchone()
        my_level = ml['level'] if ml else 0
    vals = list(levels.values())
    avg = round(sum(vals) / len(vals), 2) if vals else 0.0
    s['levels'] = levels
    s['my_level'] = my_level
    s['avg_level'] = avg
    s['updated_time_ago'] = time_ago(s.get('updated_at', ''))
    if full:
        pn = db.execute('SELECT notes FROM personal_notes WHERE song_id = ? AND user_id = ?', (s['id'], user_id)).fetchone()
        s['personal_notes'] = pn['notes'] if pn else ''
        cn = db.execute(
            'SELECT cn.text, cn.updated_at, u.name AS author_name FROM collective_notes cn LEFT JOIN users u ON cn.author_id = u.id WHERE cn.song_id = ?',
            (s['id'],),
        ).fetchone()
        s['collective_note'] = {
            'text': cn['text'], 'author_name': cn['author_name'] or '',
            'time_ago': time_ago(cn['updated_at']),
        } if cn else None
    return s

def gig_to_dict(row):
    g = dict(row)
    g.update(format_date_fr(g['date']))
    g['when'] = 'à venir' if g['dday'] >= 0 else 'passée'
    return g


# ── Auth ──────────────────────────────────────────────────────────────────────

@app.route('/api/me')
def get_me():
    if 'user_id' not in session:
        return jsonify({'error': 'Non authentifié'}), 401
    db = get_db()
    u = db.execute('SELECT id, name, is_admin FROM users WHERE id = ?', (session['user_id'],)).fetchone()
    if not u:
        session.clear()
        return jsonify({'error': 'Utilisateur introuvable'}), 401
    return jsonify(dict(u))

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    password = data.get('password') or ''
    if not name or not password:
        return jsonify({'error': 'Nom et mot de passe requis'}), 400
    db = get_db()
    u = db.execute('SELECT * FROM users WHERE LOWER(name) = LOWER(?)', (name,)).fetchone()
    if not u or not verify_password(password, u['password_hash'], u['salt']):
        return jsonify({'error': 'Identifiants incorrects'}), 401
    session.permanent = True
    session['user_id'] = u['id']
    session['user_name'] = u['name']
    return jsonify({'id': u['id'], 'name': u['name'], 'is_admin': u['is_admin']})

@app.route('/api/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'ok': True})

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    password = data.get('password') or ''
    if not name or not password:
        return jsonify({'error': 'Nom et mot de passe requis'}), 400
    if not (2 <= len(name) <= 32):
        return jsonify({'error': 'Le nom doit faire 2 à 32 caractères'}), 400
    if len(password) < 6:
        return jsonify({'error': 'Le mot de passe doit faire au moins 6 caractères'}), 400
    db = get_db()
    if db.execute('SELECT 1 FROM users WHERE LOWER(name) = LOWER(?)', (name,)).fetchone():
        return jsonify({'error': 'Ce nom est déjà utilisé'}), 400
    ph, salt = hash_password(password)
    is_admin = 0 if db.execute('SELECT 1 FROM users LIMIT 1').fetchone() else 1
    db.execute(
        'INSERT INTO users (name, password_hash, salt, is_admin, created_at) VALUES (?, ?, ?, ?, ?)',
        (name, ph, salt, is_admin, now_iso()),
    )
    db.commit()
    u = db.execute('SELECT id, name, is_admin FROM users WHERE LOWER(name) = LOWER(?)', (name,)).fetchone()
    session.permanent = True
    session['user_id'] = u['id']
    session['user_name'] = u['name']
    return jsonify(dict(u)), 201


# ── Group / Members ───────────────────────────────────────────────────────────

@app.route('/api/group')
@require_auth
def get_group():
    db = get_db()
    row = db.execute("SELECT value FROM settings WHERE key = 'group_name'").fetchone()
    return jsonify({'name': row['value'] if row else 'Mon groupe'})

@app.route('/api/group', methods=['PUT'])
@require_auth
def update_group():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    if not name:
        return jsonify({'error': 'Nom requis'}), 400
    db = get_db()
    db.execute("INSERT OR REPLACE INTO settings VALUES ('group_name', ?)", (name,))
    db.commit()
    return jsonify({'name': name})

@app.route('/api/members')
@require_auth
def get_members():
    db = get_db()
    rows = db.execute('SELECT id, name, color FROM users ORDER BY id').fetchall()
    uid = session['user_id']
    return jsonify([{**dict(r), 'you': r['id'] == uid} for r in rows])


# ── Songs ─────────────────────────────────────────────────────────────────────

@app.route('/api/songs')
@require_auth
def get_songs():
    db = get_db()
    uid, _ = current_user()
    status = request.args.get('status')
    if status:
        rows = db.execute('SELECT * FROM songs WHERE status = ? ORDER BY updated_at DESC', (status,)).fetchall()
    else:
        rows = db.execute('SELECT * FROM songs ORDER BY updated_at DESC').fetchall()
    return jsonify([song_to_dict(r, db, uid) for r in rows])

@app.route('/api/songs', methods=['POST'])
@require_auth
def create_song():
    data = request.get_json() or {}
    title = (data.get('title') or '').strip()
    author = (data.get('author') or '').strip()
    status = data.get('status', 'suggestion')
    if not title or not author:
        return jsonify({'error': 'Titre et artiste requis'}), 400
    if status not in ('suggestion', 'learning', 'ready', 'archived'):
        status = 'suggestion'
    db = get_db()
    uid, uname = current_user()
    n = now_iso()
    db.execute(
        'INSERT INTO songs (title, author, status, created_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        (title, author, status, uid, n, n),
    )
    db.commit()
    song = db.execute('SELECT * FROM songs WHERE rowid = last_insert_rowid()').fetchone()
    db.execute(
        'INSERT INTO activity (user_name, action_type, description, status_type, target_type, target_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (uname, 'add', f'a ajouté {title}', status, 'song', song['id'], n),
    )
    db.commit()
    return jsonify(song_to_dict(song, db, uid)), 201

@app.route('/api/songs/<int:song_id>')
@require_auth
def get_song(song_id):
    db = get_db()
    uid, _ = current_user()
    song = db.execute('SELECT * FROM songs WHERE id = ?', (song_id,)).fetchone()
    if not song:
        return jsonify({'error': 'Morceau introuvable'}), 404
    return jsonify(song_to_dict(song, db, uid, full=True))

@app.route('/api/songs/<int:song_id>', methods=['PUT'])
@require_auth
def update_song(song_id):
    db = get_db()
    uid, uname = current_user()
    song = db.execute('SELECT * FROM songs WHERE id = ?', (song_id,)).fetchone()
    if not song:
        return jsonify({'error': 'Morceau introuvable'}), 404
    data = request.get_json() or {}
    title = data.get('title', song['title'])
    author = data.get('author', song['author'])
    new_status = data.get('status', song['status'])
    if new_status not in ('suggestion', 'learning', 'ready', 'archived'):
        return jsonify({'error': 'Statut invalide'}), 400
    n = now_iso()
    db.execute(
        'UPDATE songs SET title = ?, author = ?, status = ?, updated_at = ? WHERE id = ?',
        (title, author, new_status, n, song_id),
    )
    if new_status != song['status']:
        db.execute(
            'INSERT INTO activity (user_name, action_type, description, status_type, target_type, target_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (uname, 'status', f'a passé {title} en {_status_label(new_status)}', new_status, 'song', song_id, n),
        )
    db.commit()
    updated = db.execute('SELECT * FROM songs WHERE id = ?', (song_id,)).fetchone()
    return jsonify(song_to_dict(updated, db, uid, full=True))

@app.route('/api/songs/<int:song_id>', methods=['DELETE'])
@require_auth
def delete_song(song_id):
    db = get_db()
    db.execute('DELETE FROM songs WHERE id = ?', (song_id,))
    db.commit()
    return jsonify({'ok': True})

@app.route('/api/songs/<int:song_id>/level', methods=['PUT'])
@require_auth
def update_level(song_id):
    data = request.get_json() or {}
    level = int(data.get('level', 0))
    if not (0 <= level <= 10):
        return jsonify({'error': 'Niveau doit être entre 0 et 10'}), 400
    db = get_db()
    uid, _ = current_user()
    n = now_iso()
    db.execute(
        'INSERT OR REPLACE INTO song_levels (song_id, user_id, level, updated_at) VALUES (?, ?, ?, ?)',
        (song_id, uid, level, n),
    )
    db.execute('UPDATE songs SET updated_at = ? WHERE id = ?', (n, song_id))
    db.commit()
    return jsonify({'level': level})

@app.route('/api/songs/<int:song_id>/personal-notes', methods=['PUT'])
@require_auth
def update_personal_notes(song_id):
    data = request.get_json() or {}
    notes = data.get('notes', '')
    db = get_db()
    uid, _ = current_user()
    db.execute(
        'INSERT OR REPLACE INTO personal_notes (song_id, user_id, notes, updated_at) VALUES (?, ?, ?, ?)',
        (song_id, uid, notes, now_iso()),
    )
    db.commit()
    return jsonify({'notes': notes})

@app.route('/api/songs/<int:song_id>/collective-note', methods=['PUT'])
@require_auth
def update_collective_note(song_id):
    data = request.get_json() or {}
    text = data.get('text', '')
    db = get_db()
    uid, uname = current_user()
    n = now_iso()
    db.execute(
        'INSERT OR REPLACE INTO collective_notes (song_id, author_id, text, updated_at) VALUES (?, ?, ?, ?)',
        (song_id, uid, text, n),
    )
    song = db.execute('SELECT title FROM songs WHERE id = ?', (song_id,)).fetchone()
    if song:
        db.execute(
            'INSERT INTO activity (user_name, action_type, description, status_type, target_type, target_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
            (uname, 'note', f"a modifié la note de {song['title']}", 'accent3', 'song', song_id, n),
        )
    db.commit()
    return jsonify({'text': text, 'author_name': uname, 'time_ago': time_ago(n)})


# ── Gigs ──────────────────────────────────────────────────────────────────────

@app.route('/api/gigs')
@require_auth
def get_gigs():
    db = get_db()
    rows = db.execute('SELECT * FROM gigs ORDER BY date ASC').fetchall()
    return jsonify([gig_to_dict(r) for r in rows])

@app.route('/api/gigs', methods=['POST'])
@require_auth
def create_gig():
    data = request.get_json() or {}
    name = (data.get('name') or '').strip()
    gig_date = (data.get('date') or '').strip()
    place = (data.get('place') or '').strip()
    duration = int(data.get('duration', 60))
    if not name or not gig_date or not place:
        return jsonify({'error': 'Nom, date et lieu requis'}), 400
    try:
        date.fromisoformat(gig_date)
    except ValueError:
        return jsonify({'error': 'Format de date invalide (YYYY-MM-DD)'}), 400
    db = get_db()
    uid, uname = current_user()
    n = now_iso()
    db.execute(
        'INSERT INTO gigs (name, date, place, duration, setlist_count, ready_count, created_at) VALUES (?, ?, ?, ?, 0, 0, ?)',
        (name, gig_date, place, duration, n),
    )
    db.commit()
    gig = db.execute('SELECT * FROM gigs WHERE rowid = last_insert_rowid()').fetchone()
    db.execute(
        'INSERT INTO activity (user_name, action_type, description, status_type, target_type, target_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        (uname, 'gig', f'a créé la prestation {name}', 'accent', 'gig', gig['id'], n),
    )
    db.commit()
    return jsonify(gig_to_dict(gig)), 201

@app.route('/api/gigs/<int:gig_id>', methods=['PUT'])
@require_auth
def update_gig(gig_id):
    db = get_db()
    gig = db.execute('SELECT * FROM gigs WHERE id = ?', (gig_id,)).fetchone()
    if not gig:
        return jsonify({'error': 'Prestation introuvable'}), 404
    data = request.get_json() or {}
    name = data.get('name', gig['name'])
    gig_date = data.get('date', gig['date'])
    place = data.get('place', gig['place'])
    duration = int(data.get('duration', gig['duration']))
    setlist_count = int(data.get('setlist_count', gig['setlist_count']))
    ready_count = int(data.get('ready_count', gig['ready_count']))
    db.execute(
        'UPDATE gigs SET name=?, date=?, place=?, duration=?, setlist_count=?, ready_count=? WHERE id=?',
        (name, gig_date, place, duration, setlist_count, ready_count, gig_id),
    )
    db.commit()
    updated = db.execute('SELECT * FROM gigs WHERE id = ?', (gig_id,)).fetchone()
    return jsonify(gig_to_dict(updated))

@app.route('/api/gigs/<int:gig_id>', methods=['DELETE'])
@require_auth
def delete_gig(gig_id):
    db = get_db()
    db.execute('DELETE FROM gigs WHERE id = ?', (gig_id,))
    db.commit()
    return jsonify({'ok': True})


# ── Activity ──────────────────────────────────────────────────────────────────

@app.route('/api/activity')
@require_auth
def get_activity():
    db = get_db()
    rows = db.execute('SELECT * FROM activity ORDER BY created_at DESC LIMIT 20').fetchall()
    return jsonify([{**dict(r), 'time_ago': time_ago(r['created_at'])} for r in rows])


if __name__ == '__main__':
    init_db()
    app.run(host='0.0.0.0', port=5000, debug=os.environ.get('FLASK_DEBUG', '0') == '1')
