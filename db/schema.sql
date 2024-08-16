-- schema.sql

--  drop all tables and recreate them 
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS clips;
DROP TABLE IF EXISTS clip_votes;
DROP TABLE IF EXISTS categories;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  username TEXT,
  password TEXT
);

CREATE TABLE IF NOT EXISTS clips (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  file TEXT,
  vote TEXT,
  categories TEXT
);

CREATE TABLE IF NOT EXISTS clip_votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  clip_id INTEGER,
  user_id INTEGER,
  vote TEXT,
  FOREIGN KEY(clip_id) REFERENCES clips(id),
  FOREIGN KEY(user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  parent_id INTEGER
);
