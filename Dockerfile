FROM node:12-alpine

# Create app directory
WORKDIR /server

# Install app dependencies
COPY package.json ./
RUN npm install

# Bundle app source
COPY . .

# Build server
RUN npm run build

ENTRYPOINT ["npm", "run", "start"]