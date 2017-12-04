# https://derickbailey.com/2017/03/09/selecting-a-node-js-image-for-docker/
# Local code ran on v6.11.3
FROM node:6.11-slim

MAINTAINER aramael <aramael@pena-alcantara.com>

WORKDIR /app

# install app dependencies
COPY package*.json ./
RUN npm install --production

# copy app source
COPY ./ ./