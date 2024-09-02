FROM node:16

# Create app directory
WORKDIR /pp/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

RUN npm run build
RUN npm run db:migrate
RUN npm run db:seed

EXPOSE 3000
EXPOSE 5432
CMD ["node","dist/main"]