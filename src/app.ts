
import Fastify, { FastifyServerOptions } from 'fastify'
import AppController from './controllers/main'
import { FOLDER_PATH } from './config'
import dotenv from 'dotenv'
import { IDeleteFileRequest, IDropCollectionRequest, IGetFilesRequest, IGetRequest, IUploadRequest } from './types'
import authPlugin from "@fastify/auth"
import bearerAuthPlugin from "@fastify/bearer-auth"
import staticPlugin from "@fastify/static"
import multipartPlugin from "@fastify/multipart"


dotenv.config()

export type AppOptions = Partial<FastifyServerOptions>;

async function buildApp(options: AppOptions = {}) {
  const app = Fastify({
    logger: true
  })
  let bearerKeys

  if (!process.env.BEARER_TOKENS) {
    app.log.error('Missing BEARER_TOKENS env variable')
    process.exit(1)
  }

  try {
    bearerKeys = new Set(JSON.parse(process.env.BEARER_TOKENS))
  } catch (e: any) {
    app.log.error('Invalid BEARER_TOKENS env variable: ' + e.message)
    process.exit(1)
  }

  app.register(multipartPlugin, {
    limits: {
      fileSize: 100 * 1024 * 1024, // 100mb
      fieldNameSize: 100, // 100 bytes
      files: 10
    }
  })
    .register(authPlugin)
    .register(bearerAuthPlugin, { keys: Array.from(bearerKeys.values()) as string[], addHook: false, verifyErrorLogLevel: 'debug' })
    .register(staticPlugin, {
      root: FOLDER_PATH,
    })
    .decorate('allowAnonymous', function (req: any, reply: any, done: any) {
      if (req.headers.authorization) {
        return done(Error('not anonymous'))
      }
      return done()
    })
    .after(() => {

      // @ts-ignore
      app.post<IUploadRequest>('/:collection', { preHandler: app.auth([app.verifyBearerAuth]) }, AppController.upload)
      // @ts-ignore
      app.delete<IDeleteFileRequest>('/:collection/:filename', { preHandler: app.auth([app.verifyBearerAuth]) }, AppController.dropFile)
      // @ts-ignore
      app.delete<IDropCollectionRequest>('/drop/:collection', { preHandler: app.auth([app.verifyBearerAuth]) }, AppController.dropCollection)
      // @ts-ignore
      app.get<IGetFilesRequest>('/:collection', { preHandler: app.auth([app.verifyBearerAuth]) }, AppController.listFiles)
      // @ts-ignore
      app.get('/collections', { preHandler: app.auth([app.verifyBearerAuth]) }, AppController.listCollections)

      app.get<IGetRequest>('/:collection/:filename', AppController.getFile)

    })

  return app
}

export { buildApp }

