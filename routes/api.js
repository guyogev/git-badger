const express = require('express');
const router = express.Router();
const db = require('../db');

/* GET users listing. */
router.get('/:email', async function(req, res, next) {
  const monthlyCommits = await db.monthlyCommitCountBy(req.params.email);
  const locStats = await db.locStatsBy(req.params.email)
  res.json({
    monthlyCommits,
    locStats,
  });
});

module.exports = router;
