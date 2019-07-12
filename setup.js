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

console.log('Dropping tables');
db.run('DROP TABLE IF EXISTS commits;');

console.log('Creating tables');

console.log('Creating commits table');
db.serialize(function () {
  db.run(`
    CREATE TABLE IF NOT EXISTS commits (
      ID            INTEGER PRIMARY KEY AUTOINCREMENT,
      commit_hash   TEXT,
      repo_href     TEXT,
      author_email  TEXT,
      datetime DATETIME);
`);
});
db.close();
