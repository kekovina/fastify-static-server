FROM node:22.4.0-alpine

WORKDIR /fastify-static-server
COPY package.json .

RUN npm i --ci
COPY . .

ENV BEARER_TOKENS=${BEARER_TOKENS}

CMD npm start
