<p align="center">
  <a href="https://github.com/guyogev/git-badger">
<<<<<<< HEAD
    <img alt="oban" src="https://fontmeme.com/permalink/190719/adb295d9b28b5092fadf8337ee09c490.png" width="435" />
=======
    <img alt="fontmeme" src="https://fontmeme.com/permalink/190719/adb295d9b28b5092fadf8337ee09c490.png" width="435" />
>>>>>>> master
  </a>
</p>

<p align="center">
<<<<<<< HEAD
  Git commit statistics that mean nothing at all.
=======
  Git statistics that mean nothing at all.
>>>>>>> master
</p>

## About

<<<<<<< HEAD
GitBadger visualizes git repositories commit history statistics.
Unlike other great code statistics tools such as [WakaTime](https://wakatime.com/vs-code-stats) & [codestats](https://codestats.net/), it doesn't require IDE integration. all the statistics are pull from the repositories git log.

It scans repositories git log, and generate a report page for every author that ever committed into master branch.

The report presents the author contribution and experience in the form of Graphs and achievement badges.

## So what does it mean

Absolutely nothing. It is just for fun. Please do not try to measure team performance using this tool.

## Badges

Badges are calculated at authors.js.
=======
GitBadger visualizes git repositories commits history statistics.
Unlike other great code statistics tools such as [WakaTime](https://wakatime.com/vs-code-stats) & [codestats](https://codestats.net/), it doesn't require IDE integration. All statistics derived from the repositories git log.

The generated report presents the author contribution and experience in the form of Graphs and achievement badges.

## So what does it mean

Absolutely nothing. It is just for fun. Please **do not** try to measure team performance using this tool.

## Badges

Badges are calculated at `authors.js`.
>>>>>>> master
Thresholds are not deeply thought through.

- Busy Bee - Author was very active lately.
- Bee hive - Author was very active for long time.
<<<<<<< HEAD
- Experience - Number of repositories the author contributed to.
=======
- Builder - Number of repositories the author contributed to.
- Experience - Number of commits by author.
>>>>>>> master
- Grow - Author was more productive lately, comparing to earlier period.
- Language writer - Author has some experience with this language.
- Language reader - Author has a lot of experience with this language.
- Rake - Author make us of Rake tasks.
- Zombie - Author is inactive for a long time.
<<<<<<< HEAD
=======

## Usage

GitBadger make use of a few scripts to read repositories logs, extract the data, store it to DB, and display the it via HTML pages serviced by an Express app.

### TLDR;
Run a demo:

``` bash
cp ./examples/bitbucket_repositories.txt /tmp/git_badger/bitbucket_repositories.txt
npm install
node ./setup.js
bash ./scripts/repositories_stats.sh
bash ./scripts/load_commits_to_db.sh
npm start
```

### In more detail

#### Setup DB

`setup.js` script initializes the sqlite3 DB.

#### Extracting data from repositories

`repositories_stats.sh` script reads data from a `REPOSITORIES_FILE` - a txt file that contains a list of git repositories SSH hrefs.

Each repository git log is parsed, and converted into a CSV.

#### Loading the data into DB

`load_commits_to_db.sh` script reads the above CSVs, and insert them it into DB.
>>>>>>> master
