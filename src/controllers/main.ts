import { FOLDER_PATH, AVAILABLE_MIMETYPES } from '../config'
import { getDirectories, getFiles, checkOrCreateCollectionExists } from '../libs'
import pump from 'pump'
import fs from 'node:fs'
import path from 'node:path'

class AppController {

  async upload(request: any, reply: any) {

    const parts = request.files()

    if (!parts) {
      return reply.status(400).send({ code: 'FILE_NOT_UPLOADED', message: 'No files were uploaded.' });
    }

    const { collection } = request.params
    const collectionPath = path.join(FOLDER_PATH, collection)

    if (!(await checkOrCreateCollectionExists(collectionPath)))
      return reply.status(500).send({ code: 'CREATE_COLLECTION_DIR_ERROR', message: 'Error due create collection directory.' })

    try {
      let uploadedCount = 0, errorsCount = 0
      let errors: string[] = []
      await new Promise(async (resolve, reject) => {
        for await (const part of parts) {
          const { fieldname, mimetype } = part
          if (!AVAILABLE_MIMETYPES.includes(mimetype)) continue
          const filePath = path.join(collectionPath, fieldname)
          pump(part.file, fs.createWriteStream(filePath))
            .on('finish', () => {
              uploadedCount += 1
              resolve(uploadedCount)
            })
            .on('error', (err) => {
              errorsCount += 1
              errors.push(err.message)
              reject(err)
            })
        }
      })
      return reply.send({ message: 'OK', uploadedCount, errorsCount, errors })
    } catch (e: any) {
      return reply.status(500).send({ code: 'FILE_WRITE_ERROR', message: e.message });
    }
  }

  getFile(request: any, reply: any) {
    const { collection, filename } = request.params
    reply.header('cache-control', 'public, max-age=31536000')
    return reply.sendFile(filename, path.join(FOLDER_PATH, collection))
  }

  dropFile(request: any, reply: any) {
    const { collection, filename } = request.params
    fs.unlinkSync(path.join(FOLDER_PATH, collection, filename))
    return reply.send({ message: 'OK' })
  }

  dropCollection(request: any, reply: any) {
    const { collection } = request.params
    fs.unlinkSync(path.join(FOLDER_PATH, collection))
    return reply.send({ message: 'OK' })
  }

  async listCollections(request: any, reply: any) {
    const collections = await getDirectories(FOLDER_PATH)
    return reply.send({ message: 'OK', collections })
  }

  async listFiles(request: any, reply: any) {
    const { collection } = request.params
    const files = await getFiles(path.join(FOLDER_PATH, collection))
    return reply.send({ message: 'OK', files })
  }
}

export default new AppController()
