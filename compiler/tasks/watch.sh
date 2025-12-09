#!/bin/bash

# Run build
bash ./compiler/tasks/build.sh

# Watch files
echo -e '\nWatching for changes 👀\n'
node compiler/scripts/javascript-watcher.js & node compiler/scripts/styles-watcher.js
