#!/bin/bash
# Reads git log CSV file, and inserts its data into DB.
# CSV is processed $BULK_SIZE lines at a time.
#
# Expect CSV to match commits table schema.

source ./scripts/constants.sh

PREFIX="INSERT OR IGNORE INTO commits(repo_href,commit_hash,author_email,datetime"
PREFIX+=",css_loc_added"
PREFIX+=",css_loc_removed"
PREFIX+=",elixir_loc_added"
PREFIX+=",elixir_loc_removed"
PREFIX+=",java_loc_added"
PREFIX+=",java_loc_removed"
PREFIX+=",js_loc_added"
PREFIX+=",js_loc_removed"
PREFIX+=",less_loc_added"
PREFIX+=",less_loc_removed"
PREFIX+=",md_loc_added"
PREFIX+=",md_loc_removed"
PREFIX+=",package_json_loc_added"
PREFIX+=",package_json_loc_removed"
PREFIX+=",rake_loc_added"
PREFIX+=",rake_loc_removed"
PREFIX+=",ruby_loc_added"
PREFIX+=",ruby_loc_removed"
PREFIX+=",sass_loc_added"
PREFIX+=",sass_loc_removed"
PREFIX+=",scss_loc_added"
PREFIX+=",scss_loc_removed"
PREFIX+=",ts_loc_added"
PREFIX+=",ts_loc_removed"
PREFIX+=") VALUES("
readonly PREFIX;
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