FROM node:22.4.0-alpine

WORKDIR /fastify-static-server
COPY package.json .
COPY package-lock.json .

RUN npm ci
COPY . .
RUN npm run build

ENV BEARER_TOKENS=${BEARER_TOKENS}

CMD npm start
