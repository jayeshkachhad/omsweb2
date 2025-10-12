#!/bin/bash

# --- 1. FORCE NVM SOURCING FOR NON-INTERACTIVE SHELL ---

# The path to nvm.sh might be in ~/.nvm/nvm.sh or /usr/local/nvm/nvm.sh
# We try the standard path for the current user's home directory.
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# --- 2. VERIFY AND USE THE TARGET NODE VERSION ---
echo "Node version before nvm use:"
node -v

# Use the installed target version
nvm use 24.8.0

echo "Node version after nvm use:"
node -v

# --- 3. DEPLOYMENT STEPS ---
cd /var/www/web/omsweb2

git pull origin main

npm install

npm run build