#!/bin/bash
THEME_LIQUID="./theme/layout/theme.liquid"

# === Assign BUILD_ENV
if [ "$1" = "--dev" ] || [ "$1" = "" ]; then
    BUILD_ENV=development
elif [ "$1" = "--prod" ]; then
    BUILD_ENV=production
fi

# Run build scripts
echo -e '\e[0;33m- Building scripts -'
node compiler/scripts/javascript.js
echo -e '\e[0;33m- Building styles -'
node compiler/scripts/styles.js

# Add build information into theme.liquid if in a Git repository
if git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo -e '\n\e[0;33mAdding build information into theme.liquid...'
    
    # Update built theme.liquid with build environment
    sed -E -i "s/build_env = \"(.*)\"/build_env = \"${BUILD_ENV}\"/" $THEME_LIQUID
    
    # Update built theme.liquid with build commit
    BUILD_COMMIT=$(git log -1 --pretty=format:%h)
    sed -E -i "s/build_commit = \"(.*)\"/build_commit = \"${BUILD_COMMIT}\"/" $THEME_LIQUID
    
    # Update built theme.liquid with build date
    BUILD_DATE=$(date '+%d-%m-%Y')
    sed -E -i "s/build_date = \"(.*)\"/build_date = \"${BUILD_DATE}\"/" $THEME_LIQUID
else
    echo -e '\n\e[0;33mGit repository not found. Skipping Git build information...'
fi

echo -e '\n\e[1;32mBuild complete 👍'
