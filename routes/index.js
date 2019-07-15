const express = require('express');
const router = express.Router();

const db = require('../db');

/* GET home page. */
router.get('/', (req, res, next) => {
  db.all('SELECT DISTINCT author_email FROM commits ORDER BY author_email',
      [],
      (err, authors) => res.render('index', { title: 'Express', authors }));
});

module.exports = router;
