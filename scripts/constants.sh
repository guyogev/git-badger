readonly REPOSITORIES_FILE='/tmp/git_badger/bitbucket_repositories.txt';
readonly CLONES_FOLDER="/tmp/git_badger/clones"
readonly GIT_STATS_FOLDER="/tmp/git_badger/git_stats"

readonly red=$'\e[1;31m'
readonly grn=$'\e[1;32m'
readonly yel=$'\e[1;33m'
readonly blu=$'\e[1;34m'
readonly mag=$'\e[1;35m'
readonly cyn=$'\e[1;36m'
readonly end=$'\e[0m'

readonly DB="./db/git_badger.sqlite"

#######################################
# Globals:
#   GIT_STATS_FOLDER - path to git stats folder.
# Arguments:
#   repo - ssh href for the repo.
# Returns
#   A path to the repo commits folder, used for repo commits data extraction
#   and processing.
#######################################
git_stats_path() {
  subfolder=$(basename "$1" .git)
  echo "$GIT_STATS_FOLDER/$subfolder"
}

#######################################
# Globals:
#   GIT_STATS_FOLDER - path to git stats folder.
# Arguments:
#   repo - ssh href for the repo.
# Returns
#   A path to the repo commits stats file.
#######################################
git_stats_commits_csv_path() {
  subfolder=$(basename "$1" .git)
  echo "$GIT_STATS_FOLDER/$subfolder/commits.csv"
}

#######################################
# Globals:
#   CLONES_FOLDER - parent folder path.
# Arguments:
#   repo - ssh href for the repo.
# Returns
#   A path to the local cloned repo.
#######################################
cloned_repo_path() {
  subfolder=$(basename "$1" .git)
  echo "$CLONES_FOLDER/$subfolder"
}