#!/bin/bash
if tmux -V ; then
    # If tmux is installed
    echo 'Setting up tmux windows'
    
    # Create a tmux window & split into two panes
    # run 'watch' in one / 'serve' in the other
    tmux kill-session
    # tmux new -s "VK & Co. Kit" "tmux splitw -d 'npm run watch | less' && npm run serve"
    tmux new -s "VK & Co. Kit" "tmux splitw -d 'npm run watch | less' && concurrently \"npm run start\""
    # sudo tmux -L /tmp/mysocket -S /private/tmp/tmux.sock new-session -s "VK & Co. Kit" "tmux splitw -d 'npm run watch | less' && npm run serve"
    # concurrently "npm run watch" "npm run serve"
else
    # If tmux not installed, ask if they'd like to install it
    echo "\n\e[1;33mWe use tmux to keep the build/deploy logs seperate."
    echo "\nWe recommend installing it (requires brew), else we will run the tasks in parallel."
    echo ""

    if read -q "choice?Press Y/y to install"; then
        # Install tmux
        brew install tmux

        # Run start with concurrently
        concurrently "npm run start"
    else
        # If not run in single pane (ugly)
        echo "\e[1;33mHave it your way! Running start with watch & serve in parallel"

        concurrently "npm run start" "npm run watch" "npm run serve" 
    fi
fi
