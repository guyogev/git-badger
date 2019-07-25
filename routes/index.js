const express = require('express');
const router = express.Router();

const db = require('../db');

/* GET home page. */
router.get('/', async (req, res, next) => {
  const authors = await db.allAuthors()
  res.render('index', { title: 'Express', authors });
});

module.exports = router;
