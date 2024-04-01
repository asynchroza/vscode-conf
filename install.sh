#!/bin/bash

OSX_CODE_DIR="$HOME/Library/Application Support/Code/User"

# Make a backup of keybinds.json at the same location
mv "$OSX_CODE_DIR/keybindings.json" "$OSX_CODE_DIR/keybindings-backup.json"

# Symlink keybinds to user's Code directory
ln -s $PWD/keybindings.json "$OSX_CODE_DIR/keybindings.json"
