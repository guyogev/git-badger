#!/bin/bash
# Reads git log CSV file, and inserts its data into DB.
# CSV is processed $BULK_SIZE lines at a time.
#
# Expect CSV to match commits table schema.
# commit_hash,repo_href,author_email,datetime

source ./scripts/constants.sh

readonly PREFIX="INSERT OR IGNORE INTO commits(repo_href,commit_hash,author_email,datetime) VALUES("
readonly SUFFIX=");"
readonly BULK_SIZE=1000;

# TODO: Remove head limit.
for repo in $(cat "$REPOSITORIES_FILE" | head -n3);
do
  printf "%s\n" "${grn}Start processing ${repo}.${end}"
  commitStatsFolder=$(git_stats_path $repo);
  commitStatsFile=$(git_stats_commits_csv_path $repo)
  cd $commitStatsFolder
  printf "%s\n" "${yel}Cleaning up old files...${end}"
  rm $file_splits
  split -d -l $BULK_SIZE commits.txt commits_part
  file_splits=$(ls | grep commits_part)
  cd -
  for f in $file_splits
  do
    printf "%s\n" "${yel}Inserting ${f} to DB.${end}"
    BULK_INSERT=$(sed "s/.*/$PREFIX&$SUFFIX/" $commitStatsFile)
    echo "BEGIN TRANSACTION;" > /tmp/sql
    echo  "$BULK_INSERT" >> /tmp/sql
    echo "COMMIT;" >> /tmp/sql
    sqlite3 ./db/git_badger.sqlite ".read /tmp/sql"
  done
  printf "%s\n" "${grn}Done processing ${repo}.${end}"
done