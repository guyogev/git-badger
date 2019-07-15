var sqlite3 = require('sqlite3').verbose()

const DBSOURCE = "./db/git_badger.sqlite"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error('aaaaaaa', err.message)
      throw err
    };
});

module.exports = db