#!/bin/bash

DB="./db/git_badger.sqlite"
QUERY="SELECT href FROM repositories ORDER BY href LIMIT 3"
CLONES_FOLDER="/tmp/clones"

: '
Reads each SSH urls from $DB, clones/syncs the repo to latest master branch.
'
for repo in $(sqlite3 $DB "$QUERY"); do
  echo -e "\nvvvvvvvvvvvvvvvvvvvv START ${repo} vvvvvvvvvvvvvvvvvvvv\n"
  subfolder=$(basename "$repo" .git)
  targetDir="$CLONES_FOLDER/$subfolder"
  mkdir -p $targetDir
  # Clone repo if it doesn't exist.
  if [ -z "$(ls -A $targetDir)" ]; then
    echo "$repo was never cloned. Cloning now..."
    git clone "$repo" "$targetDir"
  fi
  cd $targetDir
  # Force sync to latest master.
  git reset --hard origin/master
  git pull
  cd -
  echo -e "\n^^^^^^^^^^^^^^^^^^^^ END ${repo} ^^^^^^^^^^^^^^^^^^^^\n"
done
