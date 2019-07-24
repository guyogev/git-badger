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
db.run('DROP VIEW IF EXISTS commit_counters;');

db.serialize(function() {
  console.log('Creating commits table');
  db.run(`
    CREATE TABLE IF NOT EXISTS commits (
      ID                        INTEGER PRIMARY KEY AUTOINCREMENT,
      commit_hash               TEXT,
      repo_href                 TEXT,
      author_email              TEXT,
      datetime                  DATETIME,
      css_loc_added             INTEGER,
      css_loc_removed           INTEGER,
      elixir_loc_added          INTEGER,
      elixir_loc_removed        INTEGER,
      java_loc_added            INTEGER,
      java_loc_removed          INTEGER,
      js_loc_added              INTEGER,
      js_loc_removed            INTEGER,
      less_loc_added            INTEGER,
      less_loc_removed          INTEGER,
      package_json_loc_added    INTEGER,
      package_json_loc_removed  INTEGER,
      rake_loc_added            INTEGER,
      rake_loc_removed          INTEGER,
      ruby_loc_added            INTEGER,
      ruby_loc_removed          INTEGER,
      sass_loc_added            INTEGER,
      sass_loc_removed          INTEGER,
      scss_loc_added            INTEGER,
      scss_loc_removed          INTEGER,
      ts_loc_added              INTEGER,
      ts_loc_removed            INTEGER);
  `);
  console.log('Creating commit_counters view');
  db.run(`
    CREATE VIEW IF NOT EXISTS commit_counters
    AS
    SELECT author_email,
      COUNT (DISTINCT repo_href) AS total_repos,
      COUNT(*) AS total_commits,
      SUM(CASE WHEN datetime > (SELECT DATETIME('now', '-1 month')) THEN 1 ELSE 0 END) AS total_commits_in_last_month,
      SUM(CASE WHEN datetime > (SELECT DATETIME('now', '-2 month')) THEN 1 ELSE 0 END) AS total_commits_in_last_two_month,
      SUM(CASE WHEN datetime > (SELECT DATETIME('now', '-1 year')) THEN 1 ELSE 0 END) AS total_commits_in_last_year,
      SUM(CASE WHEN datetime < (SELECT DATETIME('now', '-2 year')) THEN 1 ELSE 0 END) AS total_commits_2_year_ago,
      SUM(CASE WHEN datetime < (SELECT DATETIME('now', '-3 year')) THEN 1 ELSE 0 END) AS total_commits_3_year_ago,
      SUM(css_loc_added) AS css_loc_added,
      SUM(css_loc_removed) AS css_loc_removed,
      SUM(elixir_loc_added) AS elixir_loc_added,
      SUM(elixir_loc_removed) AS elixir_loc_removed,
      SUM(java_loc_added) AS java_loc_added,
      SUM(java_loc_removed) AS java_loc_removed,
      SUM(js_loc_added) AS js_loc_added,
      SUM(js_loc_removed) AS js_loc_removed,
      SUM(less_loc_added) AS less_loc_added,
      SUM(less_loc_removed) AS less_loc_removed,
      SUM(package_json_loc_added) AS package_json_loc_added,
      SUM(package_json_loc_removed) AS package_json_loc_removed,
      SUM(rake_loc_added) AS rake_loc_added,
      SUM(rake_loc_removed) AS rake_loc_removed,
      SUM(ruby_loc_added) AS ruby_loc_added,
      SUM(ruby_loc_removed) AS ruby_loc_removed,
      SUM(sass_loc_added) AS sass_loc_added,
      SUM(sass_loc_removed) AS sass_loc_removed,
      SUM(scss_loc_added) AS scss_loc_added,
      SUM(scss_loc_removed) AS scss_loc_removed,
      SUM(ts_loc_added) AS ts_loc_added,
      SUM(ts_loc_removed) AS ts_loc_removed
      FROM commits
    GROUP BY author_email
    ORDER BY total_commits;
  `);
});
db.close();
