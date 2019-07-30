#!/bin/bash
# Reads git log CSV file, and inserts its data into DB.
# CSV is processed $BULK_SIZE lines at a time.
#
# Expect CSV to match commits table schema.

source ./scripts/constants.sh

readonly PREFIX="INSERT OR IGNORE INTO commits(repo_href,commit_hash,author_email,datetime,css_loc_added,css_loc_removed,elixir_loc_added,elixir_loc_removed,java_loc_added,java_loc_removed,js_loc_added,js_loc_removed,less_loc_added,less_loc_removed,package_json_loc_added,package_json_loc_removed,rake_loc_added,rake_loc_removed,ruby_loc_added,ruby_loc_removed,sass_loc_added,sass_loc_removed,scss_loc_added,scss_loc_removed,ts_loc_added,ts_loc_removed) VALUES("
readonly SUFFIX=");"
readonly BULK_SIZE=1000;

for repo in $(cat "$REPOSITORIES_FILE");
do
  printf "%s\n" "${grn}Start processing ${repo}.${end}"
  commitStatsFolder=$(git_stats_path $repo);
  commitStatsFile=$(git_stats_commits_csv_path $repo)
  printf "%s\n" "${yel}Inserting $commitStatsFile to DB.${end}"
  BULK_INSERT=$(sed "s/.*/$PREFIX&$SUFFIX/" $commitStatsFile)
  echo "BEGIN TRANSACTION;" > /tmp/sql
  echo  "$BULK_INSERT" >> /tmp/sql
  echo "COMMIT;" >> /tmp/sql
  sqlite3 ./db/git_badger.sqlite ".read /tmp/sql"
  printf "%s\n" "${grn}Done processing ${repo}.${end}"
done