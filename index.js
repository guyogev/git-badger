const axios = require('axios');
const fs = require("fs");

const REPO_API = 'https://api.bitbucket.org/2.0/repositories/spectory';
const USERNAME = process.env.BITBUCKET_USER;
const PW = process.env.BITBUCKET_PW;

async function fetchFrom(url, acc = []) {
  if (!url) {
    console.log(`fetchFrom: ${acc.length} repositories found`);
    return acc;
  }
  console.log(`fetchFrom: querying ${url}`);
  try {
    const res = await axios.request({
      url,
      auth: {
        username: USERNAME,
        password: PW,
      }
    });
    const reposFromPage =
      res.data.values.map(repo => repo.links.clone[0].href);
    acc = [...acc, ...reposFromPage];
    return await fetchFrom(res.data.next, acc)
  } catch (err) {
    console.error(err);
    return acc;
  }
};

fetchFrom(REPO_API).then(repos => {
  fs.writeFile(
    '/tmp/repos.txt',
    repos.join('\n'),
    err => {
      console.log(`Failed to write to file. ${err}`);
    }
  );
});