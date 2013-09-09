#!/usr/bin/env sh

GIT=$(which git)
SED=$(which sed)
current_branch=$($GIT branch | $SED -n '/\* /s///p')
develop_branch='dev'
remotes=('origin');
deploy_branches=('master' 'gh-pages' $current_branch $develop_branch);

function main {
    echo "DEBUG: merge $current_branch into $develop_branch"
    $GIT checkout $develop_branch
    $GIT merge    $current_branch

    for branch in ${deploy_branches[@]}; do
        echo "DEBUG: deploying $branch"
        $GIT checkout $branch
        $GIT merge    $develop_branch
        for remote in ${remotes[@]}; do
            echo "DEBUG: deploying $branch to remote: $remote"
            $GIT push $remote $branch
        done
    done
}

main
echo 'DEBUG: done deploying'
