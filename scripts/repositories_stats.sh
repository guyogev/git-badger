#!/bin/bash
#
# 1. Reads repositories SSH hrefs from $REPOSITORIES_FILE (Assumes the caller
#    has SSH access to the repositories).
# 2. Clones each repositoty to $CLONES_FOLDER unless local copy already exist.
# 3. Syncs each repository to master branch.

source ./scripts/constants.sh

commit_stats() {
  local repo=$1
  for commit in $(git --no-pager log --format='%H')
  do
    # printf "%s\n" "${yel}Processing commit $commit...${end}"
    local stats=$(git --no-pager show $commit --numstat --format='"%H","%ae","%aI"')
    local files_count=$(echo "$stats" | wc -l)
    if(( files_count > 100 )); then
      printf "%s\n" "${mag}$commit changed too many files, ignoring...${end}"
      continue
    fi
    local css_loc_added=0
    local css_loc_removed=0
    local elixir_loc_added=0
    local elixir_loc_removed=0
    local java_loc_added=0
    local java_loc_removed=0
    local js_loc_added=0
    local js_loc_removed=0
    local less_loc_added=0
    local less_loc_removed=0
    local package_json_loc_added=0
    local package_json_loc_removed=0
    local rake_loc_added=0
    local rake_loc_removed=0
    local ruby_loc_added=0
    local ruby_loc_removed=0
    local sass_loc_added=0
    local sass_loc_removed=0
    local scss_loc_added=0
    local scss_loc_removed=0
    local ts_loc_added=0
    local ts_loc_removed=0

    local line_to_write="\"$repo\","$(echo "$stats" | head -n 1)
    while read line;
    # Line is in the format: <#LOC added> <#LOC deleted> <File name>
    do
      local loc_added=$(echo $line | awk '{print $1;}')
      local loc_removed=$(echo $line | awk '{print $2;}')
      if [[ $loc_added == "-" ]] || [[ $loc_removed == "-" ]];
      then
        # Ignore binary file
        continue
      fi
      # JS
      if [[ $line == *.js ]];
      then
        let $((js_loc_added += loc_added))
        let $((js_loc_removed += loc_removed))
        continue
      fi
      # package.json
      if [[ $line == *package.json ]];
      then
        let $((package_json_loc_added += loc_added))
        let $((package_json_loc_removed += loc_removed))
        continue
      fi
      # TS
      if [[ $line == *.ts ]];
      then
        let $((ts_loc_added += loc_added))
        let $((ts_loc_removed += loc_removed))
        continue
      fi
      # CSS
      if [[ $line == *.css ]];
      then
        let $((css_loc_added += loc_added))
        let $((css_loc_removed += loc_removed))
        continue
      fi
      # SCSS
      if [[ $line == *.scss ]];
      then
        let $((scss_loc_added += loc_added))
        let $((scss_loc_removed += loc_removed))
        continue
      fi
      # SASS
      if [[ $line == *.sass ]];
      then
        let $((sass_loc_added += loc_added))
        let $((sass_loc_removed += loc_removed))
        continue
      fi
      # LESS
      if [[ $line == *.less ]];
      then
        let $((less_loc_added += loc_added))
        let $((less_loc_removed += loc_removed))
        continue
      fi
      # Ruby
      if [[ $line == *.rb ]];
      then
        let $((ruby_loc_added += loc_added))
        let $((ruby_loc_removed += loc_removed))
        continue
      fi
      # Rake
      if [[ $line == *.rake ]];
      then
        let $((rake_loc_added += loc_added))
        let $((rake_loc_removed += loc_removed))
        continue
      fi
      # Java
      if [[ $line == *.java ]];
      then
        let $((java_loc_added += loc_added))
        let $((java_loc_removed += loc_removed))
        continue
      fi
      # Java
      if [[ $line == *.ex ]] || [[ $line == *.exs ]];
      then
        let $((elixir_loc_added += loc_added))
        let $((elixir_loc_removed += loc_removed))
        continue
      fi
    done <<< "$stats"
    # Order must match INSERT commant.
    line_to_write+=",$css_loc_added"
    line_to_write+=",$css_loc_removed"
    line_to_write+=",$elixir_loc_added"
    line_to_write+=",$elixir_loc_removed"
    line_to_write+=",$java_loc_added"
    line_to_write+=",$java_loc_removed"
    line_to_write+=",$js_loc_added"
    line_to_write+=",$js_loc_removed"
    line_to_write+=",$less_loc_added"
    line_to_write+=",$less_loc_removed"
    line_to_write+=",$package_json_loc_added"
    line_to_write+=",$package_json_loc_removed"
    line_to_write+=",$rake_loc_added"
    line_to_write+=",$rake_loc_removed"
    line_to_write+=",$ruby_loc_added"
    line_to_write+=",$ruby_loc_removed"
    line_to_write+=",$sass_loc_added"
    line_to_write+=",$sass_loc_removed"
    line_to_write+=",$scss_loc_added"
    line_to_write+=",$scss_loc_removed"
    line_to_write+=",$ts_loc_added"
    line_to_write+=",$ts_loc_removed"
    echo "$line_to_write" >> $2
  done
}

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
  # TODO: uncomment next lines.
  # git reset --hard origin/master
  # git pull
  # Extract commits stats.
  commitStatsFolder=$(git_stats_path $repo);
  commitStatsFile=$(git_stats_commits_csv_path $repo)
  mkdir -p $commitStatsFolder
  printf "%s\n" "${yel}Extracting commits data from git log into $commitStatsFile.${end}"
  # Format log to CSV.
  cat /dev/null > $commitStatsFile
  commit_stats $repo $commitStatsFile
  cd -
}

for repo in $(cat "$REPOSITORIES_FILE");
do
  printf "%s\n" "${grn}Start processing ${repo}.${end}"
  process_repo $repo
  printf "%s\n" "${grn}Done processing ${repo}.${end}"
done
