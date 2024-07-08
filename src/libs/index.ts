import fs from 'node:fs/promises'

type Dirent = {
  isDirectory: () => boolean,
  name: string
}

export const checkOrCreateCollectionExists = async (collectionPath: string) => {
  try {
    await fs.access(collectionPath, fs.constants.R_OK | fs.constants.W_OK);
  } catch {
    const a = await fs.mkdir(collectionPath, { recursive: true })
  }
  return true;
}

export const getDirectories = async (source: string) => {
  try {
    return (await fs.readdir(source, { withFileTypes: true }))
      .filter((dirent: Dirent) => dirent.isDirectory())
      .map((dirent: Dirent) => dirent.name)
  } catch (e) {
    return []
  }
}

export const getFiles = async (source: string) => {
  try {
    return (await fs.readdir(source, { withFileTypes: true }))
      .filter((dirent: Dirent) => !dirent.isDirectory())
      .map((dirent: Dirent) => dirent.name)
  } catch (e) {
    return []
  }
}
