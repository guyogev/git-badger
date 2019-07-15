const express = require('express');
const router = express.Router();

const db = require('../db');


/* GET users listing. */
router.get('/:email', function(req, res, next) {
  db.all(`
    SELECT * FROM commit_counters
    WHERE author_email='${req.params.email}';
    `,
    [],
    (err, counters) => res.render('author', { title: req.params.email, counters }));
    // res.send(req.params.email);
});

module.exports = router;
