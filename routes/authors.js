const express = require('express');
const router = express.Router();

const db = require('../db');

/**
 * Calculates which badges the author has according to commits stats from DB.
 * @param {!Array<!Object>} counters Commits stats from DB.
 * @return {!Array<{name: string, value: number|undefined, }>}
 * @private
 * TODO: Move method into a helper module that would be easy to test.
 */
function calcBadges_(counters) {
  const res = [];

  // Experience badge
  const experience = { name: 'experience', value: counters.total_commits };
  if (counters.total_commits < 500) {
    experience.level = 1;
  } else if (counters.total_commits < 1500) {
    experience.level = 2;
  } else if (counters.total_commits < 2500) {
    experience.level = 3;
  } else if (counters.total_commits < 3500) {
    experience.level = 4;
  } else {
    experience.level = 5;
  }
  res.push(experience);

  // Builder badge
  const builder = { name: 'builder', value: counters.total_repos };
  if (counters.total_repos < 3) {
    builder.level = 0;
  } else if (counters.total_repos <= 5) {
    builder.level = 1;
  } else if (counters.total_repos <= 10) {
    builder.level = 2;
  } else if (counters.total_repos <= 20) {
    builder.level = 3;
  } else if (counters.total_repos <= 30) {
    builder.level = 4;
  } else {
    builder.level = 5;
  }
  res.push(builder);

  // Zombie badge
  if (counters.total_commits_in_last_year === 0) {
    res.push({ name: 'zombie' });
  };

  // Busy bee badges
  if (counters.total_commits_in_last_month > 10) {
    res.push({ name: 'busy-bee' });
  };
  if (counters.total_commits_in_last_year > 1000) {
    res.push({ name: 'busy-bee-hive' });
  };

  // Grow badge
  if (counters.total_commits_in_last_month > 0 &&
    counters.total_commits_in_last_month * 2 > counters.total_commits_in_last_two_month) {
    res.push({ name: 'grow' });
  };

  // JS badges
  if (counters.js_loc_added > 1000) {
    res.push({ name: 'js-writer' });
  };
  if (counters.js_loc_added > 100000) {
    res.push({ name: 'js-reviewer' });
  };

  // TS badges
  if (counters.ts_loc_added > 1000) {
    res.push({ name: 'ts-writer' });
  };
  if (counters.ts_loc_added > 100000) {
    res.push({ name: 'ts-reviewer' });
  };
  // Package JSON badge
  if (counters.package_json_loc_added + counters.package_json_loc_removed > 200) {
    res.push({ name: 'package-manager' });
  };

  // Ruby badges
  if (counters.ruby_loc_added > 1000) {
    res.push({ name: 'ruby-writer' });
  };
  if (counters.ruby_loc_added + counters.rake_loc_added > 50000) {
    res.push({ name: 'ruby-reviewer' });
  };

  // Rake badge
  if (counters.rake_loc_added > 1000) {
    res.push({ name: 'rake-writer' });
  };

  // CSS badges
  if (counters.css_loc_added > 1000) {
    res.push({ name: 'css-writer' });
  };
  if (counters.css_loc_added > 100000) {
    res.push({ name: 'css-reviewer' });
  };

  // Sass/Scss badges
  if (counters.scss_loc_added + counters.sass_loc_added > 1000) {
    res.push({ name: 'sass-writer' });
  };
  if (counters.scss_loc_added + counters.sass_loc_added > 100000) {
    res.push({ name: 'sass-reviewer' });
  };

  // Elixir badges
  if (counters.elixir_loc_added > 1000) {
    res.push({ name: 'elixir-writer' });
  };
  if (counters.elixir_loc_added > 100000) {
    res.push({ name: 'elixir-reviewer' });
  };

  // Java badges
  if (counters.java_loc_added > 1000) {
    res.push({ name: 'java-writer' });
  };
  if (counters.java_loc_added > 100000) {
    res.push({ name: 'java-reviewer' });
  };

  // MD badges
  if (counters.md_loc_added > 100) {
    res.push({ name: 'md-writer' });
  };

  return res.sort((a, b) => a.name > b.name ? 1 : -1);
}

/* GET users listing. */
router.get('/:email', async function(req, res, next) {
  const counters = await db.commitCountersBy(req.params.email)
  res.render('author', {
    badges: calcBadges_(counters),
    counters,
  });
});

module.exports = router;
