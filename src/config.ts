import path from 'node:path'

const PORT = +(process.env.PORT || 3000)
const FOLDER_PATH = path.join(__dirname, '..', 'data')
const AVAILABLE_MIMETYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg+xml']

export { PORT, FOLDER_PATH, AVAILABLE_MIMETYPES }
