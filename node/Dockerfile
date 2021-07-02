FROM node:14.15.4-alpine
WORKDIR '/app'
COPY ./package.json ./
COPY ./start.sh ./start.sh
RUN npm install jest -g
RUN npm install 
COPY . .
