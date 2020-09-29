
FROM node:12-alpine as builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

COPY ormconfig.docker.json ./ormconfig.json
COPY .env .

EXPOSE 4000

CMD [ "npm", "run", "start" ]