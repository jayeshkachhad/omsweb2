#!/bin/bash

# ... (NVM setup lines as above)

# Use the specific version you confirmed is installed (v24.8.0)
nvm use 24.8.0
# --- DEPLOYMENT STEPS ---
cd /var/www/web/omsweb2

git pull origin main

npm install

npm run build