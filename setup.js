const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './db/git_badger.sqlite';

const db = new sqlite3.Database(
  DB_PATH,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error(err.message);
    }
  });

console.log('Dropping repositories table');
db.run('DROP TABLE IF EXISTS repositories;');
console.log('Creating repositories table');
db.run('CREATE TABLE IF NOT EXISTS repositories (name TEXT, href TEXT, UNIQUE(href));');
db.close();
