FROM node:20-alpine

RUN npm install -g nodemon

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run vercel-build

EXPOSE 5000

CMD [ "npm", "run", "dev" ]