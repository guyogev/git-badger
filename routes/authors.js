const express = require('express');
const router = express.Router();

const db = require('../db');

function calcBadges(counters) {
  const res = [];
  res.push({ name: 'experience', value: counters.total_commits.toString().length })
  if (counters.total_commits_in_last_year === 0) {
    res.push({ name: 'zombie' });
  };
  if (counters.total_commits_in_last_month > 10) {
    res.push({ name: 'busy-bee' });
  };
  if (counters.total_commits_in_last_year > 1000) {
    res.push({ name: 'busy-bee-hive' });
  };
  if (counters.total_repos > 2) {
    res.push({ name: 'juggler', value: counters.total_repos });
  };
  if (counters.total_commits_in_last_month > 0 &&
    counters.total_commits_in_last_month * 2 > counters.total_commits_in_last_two_month) {
    res.push({ name: 'grow' });
  };
  return res;
}

/* GET users listing. */
router.get('/:email', function(req, res, next) {
  debugger
  db.all(`
    SELECT * FROM commit_counters
    WHERE author_email='${req.params.email}';
    `, [],
    (err, rows) => {
      debugger
      counters = rows[0];
      res.render('author', {
        badges: calcBadges(counters),
        counters,
        title: req.params.email,
      });
    });
  // res.send(req.params.email);
});

module.exports = router;
