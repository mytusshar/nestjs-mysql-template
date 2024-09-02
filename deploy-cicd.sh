For first time deploy using pm2

-   npm install -g pm2 (Only 1 time) PORT: (3000)
-   npm run build
-   cp .env into dist
-   cp google-cred.json dist
-   pm2 start dist/main.js OR node dist/main.js


Later Deployments:
pm2 stop 0
npm install
npm run build
npm run db:migrate
npm run db:seed
cp .env dist
cp google-cred.json dist
pm2 restart 0
