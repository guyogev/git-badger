var sqlite3 = require('sqlite3').verbose()

const DB_SOURCE = "./db/git_badger.sqlite"

let db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(`Failed to open ${DB_SOURCE}`, err.message)
      throw err
    };
});

function allAuthors() {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT author_email, COUNT(*) AS total_commits
      FROM commits
      WHERE author_email LIKE '%@%'
      GROUP BY author_email
      ORDER BY total_commits DESC`,
      [],
      (err, rows) => resolve(rows));
  });
}

function commitCountersBy(email) {
  return new Promise((resolve, reject) => {
    // FIXME: SQL injection attack vector.
    db.all(`
      SELECT * FROM commit_counters
      WHERE author_email='${email}';
    `, [],
    (err, rows) => {
      resolve(rows[0]);
    });
  });
}

function monthlyCommitCountBy(email) {
  return new Promise((resolve, reject) => {
    // FIXME: SQL injection attack vector.
    db.all(`
    SELECT COUNT(*) AS total_commits,
           datetime,
           strftime('%Y/%m', datetime) AS yyyymm
    FROM commits
    WHERE author_email='${email}'
    GROUP BY yyyymm;
    `, [],
    (err, rows) => {
      resolve(rows);
    });
  });
}

function locStatsBy(email) {
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT SUM(css_loc_added) AS css,
        SUM(elixir_loc_added) AS elixir,
        SUM(java_loc_added) AS java,
        SUM(js_loc_added) AS js,
        SUM(less_loc_added) AS less,
        SUM(rake_loc_added) + SUM(ruby_loc_added) AS ruby,
        SUM(sass_loc_added) + SUM(scss_loc_added) AS sass_scss,
        SUM(ts_loc_added) AS ts
      FROM commits
      WHERE author_email='${email}'
      GROUP BY author_email
    `, [],
    (err, rows) => {
      resolve(rows[0]);
    });
  });
}

module.exports = {
  allAuthors,
  commitCountersBy,
  monthlyCommitCountBy,
  locStatsBy,
}