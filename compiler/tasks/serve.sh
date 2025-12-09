#!/bin/bash
# Login to store
#zsh ./compiler/tasks/cli-login.sh

# Run build
zsh ./compiler/tasks/build.sh

# Serve files
cd theme && shopify theme dev --theme-editor-sync
echo "this"
