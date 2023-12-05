FROM node:latest

EXPOSE 80:8080
# RUN mkdir -p /usr/src/app/node
WORKDIR /usr/src/app
# WORKDIR ..

COPY *.json .
COPY server.js .
# COPY pages/* pages
# Install npm dependencies
WORKDIR /usr/src/app
RUN npm install

RUN npm install -g express
RUN npm install -g body-parser
RUN npm install -g mysql
RUN npm add express
RUN npm add body-parser
RUN npm add mysql

CMD ["npm","start"]