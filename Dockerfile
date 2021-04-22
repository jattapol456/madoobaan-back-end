FROM node:12.21-alpine As build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:12.21-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=${NODE_ENV}

COPY . .

COPY --from=build /usr/src/app/dist ./dist

CMD ["node", "dist/main"]