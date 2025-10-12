#!/bin/bash

# --- NVM SETUP ---
# Check if NVM is installed and load it
# The path to nvm.sh might vary, but this is a common one for Ubuntu/Bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion" # This loads nvm bash_completion

# Ensure the correct Node version is used
# Replace '24' with the major version you need (e.g., 24, 22, 20)
nvm use 24

# --- DEPLOYMENT STEPS ---
cd /var/www/web/omsweb2

git pull origin main

npm install

npm run build