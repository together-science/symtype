#!/bin/bash

# exit on any failure
set -e

do_tsc="yes"
mode=""

# loop through options
while test $# -gt 0
do
    case "$1" in
        --dev) echo "--dev"
            mode="--dev"
            ;;
        --no_tsc) echo "--no_tsc"
            do_tsc="no"
            ;;
        --*) echo "bad option $1"
            ;;
        *) echo "argument ignored: $1"
            ;;
    esac
    shift
done

# save information about the current branch in public
echo "$config" >branch.txt
git rev-parse --abbrev-ref HEAD >>branch.txt
date >>branch.txt

if [ "$do_tsc" = "yes" ]; then
    # do a TSC build as a sanity check
    echo "Doing a tsc build ..."
    tsc --version
    tsc --build --verbose
fi

# esbuild the ts/js
echo "Building symtype ..."
node ./esbuild.config.js symtype $mode
node ./esbuild.config.js testing $mode

echo "Done."
