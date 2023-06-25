-- Active: 1687552480612@@127.0.0.1@3306
CREATE TABLE users (
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    created_at TEXT DEFAULT (DATETIME('now','localtime'))
);

drop table posts;
CREATE TABLE posts (
    id TEXT NOT NULL UNIQUE PRIMARY KEY,
    creator_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes integer DEFAULT 0,
    dislikes integer DEFAULT 0,
    created_at TEXT DEFAULT (DATETIME('now','localtime')),
    updated_at TEXT,
    FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE likes_dislikes (
    user_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    like integer,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (post_id) REFERENCES posts(id)
);