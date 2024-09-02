#!/bin/sh
echo "Start Deployment"
cd nestjs-app
pm2 stop 0
git stash
git pull origin main
git stash apply
npm install
npm run build
npm run db:drop
npm run db:create
npm run db:migrate
npm run db:seed
cp .env dist
cp google-cred.json dist
pm2 restart 0
pm2 logs