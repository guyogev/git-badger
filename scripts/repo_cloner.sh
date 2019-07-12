#!/bin/bash
#
# 1. Reads repositories SSH hrefs from $REPOSITORIES_FILE (Assumes the caller
#    has SSH access to the repositories).
# 2. Clones each repositoty to $CLONES_FOLDER unless local copy already exist.
# 3. Syncs each repository to master branch.

source ./scripts/constants.sh

#######################################
# Extract repo's git log data into GIT_STATS_FOLDER.
# Clones/syncs the repo to latest master branch in the process.
# Arguments:
#   repo - SSH href for the repo.
#######################################
process_repo() {
  repo=$1
  targetDir=$(cloned_repo_path $repo)
  mkdir -p $targetDir
  # Clone repo if it doesn't exist.
  if [ -z "$(ls -A $targetDir)" ]; then
    printf "%s\n" "${yel}Repo was never cloned. Cloning now...${end}"
    git clone "$repo" "$targetDir"
  fi
  cd $targetDir
  # Force sync to latest master.
  printf "%s\n" "${yel}Syncing to latest master commit.${end}"
  git reset --hard origin/master
  git pull
  # Extract commits stats.
  commitStatsFolder=$(git_stats_path $repo);
  commitStatsFile=$(git_stats_commits_csv_path $repo)
  mkdir -p $commitStatsFolder
  printf "%s\n" "${yel}Extracting commits data from git log into $commitStatsFile.${end}"
  # Format log to CSV.
  escapedRepo=$(echo "$repo" | sed 's/\//\\\//g')
  git --no-pager log --format='"%H","%ae","%aI"' | \
      sed "s/.*/"\"${escapedRepo}\"",&/" > \
      $commitStatsFile
  # Done.
  cd -
}

# TODO: Remove head limit
for repo in $(cat "$REPOSITORIES_FILE" | head -n3);
do
  printf "%s\n" "${grn}Start processing ${repo}.${end}"
  process_repo $repo
  printf "%s\n" "${grn}Done processing ${repo}.${end}"
done
