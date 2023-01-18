# FROM node:alpine
FROM keymetrics/pm2:latest-alpine

ENV TZ="America/Los_Angeles"

# Create app directory
WORKDIR /usr/src/app

COPY . .

RUN apk add --update python make g++

RUN npm install

EXPOSE 9999

CMD ["pm2-docker", "start", "pm2.json"]
