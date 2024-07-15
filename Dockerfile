
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json ./
RUN npm pkg set scripts.prepare="echo 'skip prepare'"
RUN npm i
COPY . .
RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/package-lock.json ./package-lock.json

RUN npm pkg set scripts.prepare="echo 'skip prepare'"
RUN npm i --production

EXPOSE 3001

CMD ["node", "dist/server.js"]
