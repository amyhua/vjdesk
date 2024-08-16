/* eslint-disable consistent-return */
/* eslint-disable no-console */
/* eslint-disable no-bitwise */
/* eslint-disable import/no-extraneous-dependencies */
const sqlite3 = require("sqlite3").verbose();

// Connecting to or creating a new SQLite database file
const db = new sqlite3.Database(
  process.env.DB_LOCAL_PATH || './db/development.db',
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log("Connected to the SQlite database.");
  }
);

// Insert new data into the table, optionally
const seedClips = [];
const seedCategories = ["particles"];

// Serialize method ensures that database queries are executed sequentially
db.serialize(() => {
  // Create the clips table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS clips (
        id INTEGER PRIMARY KEY,
        file TEXT,
        vote TEXT
      )`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Created clips table.");

      // Clear the existing data in the clips table
      db.run(`DELETE FROM clips`, (delErr) => {
        if (delErr) {
          return console.error(delErr.message);
        }
        console.log("All rows deleted from clips");

        const insertSql = `INSERT INTO clips(file, vote) VALUES(?, ?)`;

        seedClips.forEach((item) => {
          db.run(insertSql, item, function insertClip(insertErr) {
            if (insertErr) {
              return console.error(insertErr.message);
            }
            const id = this.lastID; // get the id of the last inserted row
            console.log(`Clips Rows inserted, ID ${id}`);
          });
        });
      });
    }
  );

  // Create the categories table if it doesn't exist
  db.run(
    `CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT
      )`,
    (err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Created categories table.");

      // Clear the existing data in the categories table
      db.run(`DELETE FROM categories`, (delErr) => {
        if (delErr) {
          return console.error(delErr.message);
        }
        console.log("All rows deleted from categories");

        const insertSql = `INSERT INTO categories(name) VALUES(?)`;

        seedCategories.forEach((item) => {
          db.run(insertSql, item, function insert(insertErr) {
            if (insertErr) {
              return console.error(insertErr.message);
            }
            const id = this.lastID; // get the id of the last inserted row
            console.log(`Categories Rows inserted, ID ${id}`);
          });
        });

        //   Close the database connection after all insertions are done
        db.close((closeErr) => {
          if (closeErr) {
            return console.error(closeErr.message);
          }
          console.log("Closed the database connection.");
        });
      });
    }
  );
});
