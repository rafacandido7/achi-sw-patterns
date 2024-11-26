FROM node:20-alpine

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./
COPY .env ./
COPY tsconfig.json ./

RUN yarn install

COPY . .

RUN yarn run build

CMD ["node", "dist/main"]

EXPOSE 80
