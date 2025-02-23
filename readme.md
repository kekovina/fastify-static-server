# Fastify Static Server
![Fastify](https://img.shields.io/badge/fastify-%23000000.svg?style=for-the-badge&logo=fastify&logoColor=white) 
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![RollupJS](https://img.shields.io/badge/RollupJS-ef3335?style=for-the-badge&logo=rollup.js&logoColor=white)

Easy to use Node.js server for statics


## How to use

### Download

```
  git clone https://github.com/kekovina/fastify-static-server.git
```
or

```
  git@github.com:kekovina/fastify-static-server.git
```


### Manually

0. ``` npm i ```

1. Copy `.env.example` and rename to `.env`

2. Set `Bearer tokens` in `.env`

3. ```npm run start``` 

### Docker

1. Add `docker-compose.yml`

```yml
...
static-server:
    container_name: static-server
    restart: always
    build:
      context: '.'
    ports:
      - 8081:3000
    environment:
      - BEARER_TOKENS=${BEARER_TOKENS}
    volumes: 
      - '${path-to}:/static-data/static'

...
```
BEARER_TOKENS is array(like a ``` ['token', 'token2'] ```)


## API Reference

#### Upload item

```http
  POST /{collection}
  Content-Type: multipart/form-data
  Authorization: Bearer {token}
```
Files field name will be set as filename on server

If collection doesn`t exists, it will be created.

Available mime types:

| Type |
| :-------- | 
| `image/png`      | 
| `image/jpeg`      | 
| `image/gif`      | 
| `image/webp`      | 
| `image/svg+xml`      | 

#### Get item

```http
  GET /{collection}/{filename}
```

#### Get items from collection

```http
  GET /{collection}
  Authorization: Bearer {token}
```

#### Get all collections

```http
  GET /collections
  Authorization: Bearer {token}
```

#### Drop item

```http
  DELETE /{collection}/{filename}
  Authorization: Bearer {token}
```

#### Drop collection

```http
  DELETE /{collection}
  Authorization: Bearer {token}
```


## Roadmap

- Image optimization
- Jest tests

