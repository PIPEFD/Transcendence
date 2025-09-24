PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    elo INTEGER DEFAULT 200,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    pass TEXT NOT NULL,
    created TEXT DEFAULT CURRENT_TIMESTAMP,
    last_login TEXT 
);

-- tabla de usuarios time_to_expire_mins => temporalmente 500

CREATE TABLE IF NOT EXISTS twofa_codes (
		id INTEGER PRIMARY KEY AUTOINCREMENT, 
		user_id INTEGER NOT NULL, 
		code TEXT NOT NULL, 
		created_at TEXT DEFAULT CURRENT_TIMESTAMP, 
		time_to_expire_mins INTEGER DEFAULT 500,
		attempts_left INTEGER DEFAULT 3, 
		FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- tabla de autorizacion

CREATE TABLE IF NOT EXISTS friend_request (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (sender_id, receiver_id),
    FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- solicitudes de amistad

CREATE TABLE IF NOT EXISTS friends (
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE
);

-- tabla de amigos

CREATE TABLE IF NOT EXISTS ranking (
    user_id INTEGER PRIMARY KEY,
    games_played INTEGER DEFAULT 0,
    games_win INTEGER DEFAULT 0,
    games_lose INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ranking tabla

CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    message_type TEXT NOT NULL DEFAULT 'text', -- Tipos: 'text', 'game_invite', 'system_notification'
    is_read INTEGER NOT NULL DEFAULT 0, -- Booleano (0 = no leído, 1 = leído)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (receiver_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS blocked_users (
    blocker_id INTEGER NOT NULL, -- Quien realiza el bloqueo
    blocked_id INTEGER NOT NULL, -- Quien es bloqueado
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocker_id, blocked_id), -- define una sola clave primaria que utiliza la combinación de los valores de ambas columnas.
    FOREIGN KEY (blocker_id) REFERENCES users(id),
    FOREIGN KEY (blocked_id) REFERENCES users(id)
);
-- gestion de chat