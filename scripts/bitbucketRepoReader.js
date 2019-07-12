/**
 * @fileoverview Scans a user Bitbucket account, and writes data to
 * OUTPUT_FILE.
 *
 * Expects BITBUCKET_PW & BITBUCKET_USER ENV vars to be set.
 */

const axios = require('axios');
const fs = require('fs');

// Bitbucket credentials
const PW = process.env.BITBUCKET_PW;
const USERNAME = process.env.BITBUCKET_USER;

const OUTPUT_FILE = '/tmp/git_badger/bitbucket_repositories.txt';
const REPO_API = 'https://api.bitbucket.org/2.0/repositories/spectory';

/**
 * Scans repositories from bitbucket page by page, extracting the each
 * repository SSH href.
 * @param {string} pageUrl
 * @param {!Array<!<Array<string>>=} acc
 * @returns {!Array<!<Array<string>>} Repositories SSH href.
 */
async function fetchFrom(pageUrl, acc = []) {
  if (!pageUrl) {
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
      res.data.values.map(repo => repo.links.clone[1].href);
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
  console.log(`fetchFrom: ${repos.length} repositories found. Writing to ${OUTPUT_FILE}`);
  const file = fs.createWriteStream(OUTPUT_FILE);
  file.on('error', (err) => console.error(err));
  repos.sort().forEach((r) => file.write(r + '\n'));
  file.end();
});