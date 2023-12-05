FROM node:latest

RUN mkdir -p /usr/src/app/react
WORKDIR /usr/src/app/react

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 80:3000

# CMD ["npm", "start"]
