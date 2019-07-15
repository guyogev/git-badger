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
// db.run('DROP TABLE IF EXISTS commits;');

db.serialize(function () {
  console.log('Creating commits table');
  db.run(`
    CREATE TABLE IF NOT EXISTS commits (
      ID            INTEGER PRIMARY KEY AUTOINCREMENT,
      commit_hash   TEXT,
      repo_href     TEXT,
      author_email  TEXT,
      datetime DATETIME);
  `);
  console.log('Creating commit_counters view');
  db.run(`
    CREATE VIEW IF NOT EXISTS commit_counters
    AS
    SELECT author_email,
      COUNT(*) AS total_commits,
      SUM(CASE WHEN datetime > (SELECT DATETIME('now', '-1 month')) THEN 1 ELSE 0 END) AS total_commits_in_last_month,
      SUM(CASE WHEN datetime > (SELECT DATETIME('now', '-1 year')) THEN 1 ELSE 0 END) AS total_commits_in_last_year,
      SUM(CASE WHEN datetime < (SELECT DATETIME('now', '-1 year')) THEN 1 ELSE 0 END) AS total_commits_1_year_ago,
      SUM(CASE WHEN datetime < (SELECT DATETIME('now', '-2 year')) THEN 1 ELSE 0 END) AS total_commits_2_year_ago,
      SUM(CASE WHEN datetime < (SELECT DATETIME('now', '-3 year')) THEN 1 ELSE 0 END) AS total_commits_3_year_ago
    FROM commits
    GROUP BY author_email
    ORDER BY total_commits;
  `);
});
db.close();
