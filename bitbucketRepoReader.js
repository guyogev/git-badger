/**
 * @fileoverview Script that scans a user Bitbucket account, and writes data to
 * DB.
 *
 * Expects BITBUCKET_PW & BITBUCKET_USER ENV vars to be set.
 */

const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();


const PW = process.env.BITBUCKET_PW;
const REPO_API = 'https://api.bitbucket.org/2.0/repositories/spectory';
const USERNAME = process.env.BITBUCKET_USER;
const DB_PATH = './db/git_badger.sqlite';

const DB = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log(`Connected to the ${DB_PATH} database.`);
});

/**
 * Scans repositories from bitbucket page by page, extracting the each
 * repository SSH href.
 * @param {string} pageUrl
 * @param {!Array<!<Array<string>>=} acc
 * @returns {!Array<!<Array<string>>} Repositories SSH href.
 */
async function fetchFrom(pageUrl, acc = []) {
  if (!pageUrl) {
    console.log(`fetchFrom: ${acc.length} repositories found`);
    return acc;
  }
  console.log(`fetchFrom: querying ${pageUrl}`);
  try {
    const res = await axios.request({
      url: pageUrl,
      auth: {
        username: USERNAME,
        password: PW,
      }
    });
    const reposFromPage =
      res.data.values.map(repo => ({
        href: repo.links.clone[1].href,
        name: repo.name
      }));
    acc = [...acc, ...reposFromPage];
    return await fetchFrom(res.data.next, acc)
  } catch (err) {
    console.error(`fetchFrom failed with error: ${err}`);
    console.error('Are BITBUCKET_PW & BITBUCKET_USER ENV set correctly?\n');
    process.exit(1);
  }
};

/** Writes repositories SSH href to OUTPUT_FILE, adds newline at EOF. */
fetchFrom(REPO_API).then(repos => {
  DB.serialize(() => {
    console.log(`Writing to ${DB_PATH}`)
    DB.run("begin transaction");
    DB.prepare("INSERT OR IGNORE INTO repositories(name,href) VALUES (?,?)");
    repos.forEach((r) => DB.run(
      "INSERT OR IGNORE INTO repositories(name,href) VALUES (?,?)",
      r.name, r.href));
    DB.run("commit");
  });
});
