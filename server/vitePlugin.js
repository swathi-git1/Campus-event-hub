import { handleApiRequest } from './apiRouter.js'

export function campusApiPlugin() {
  return {
    name: 'campus-event-hub-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          await handleApiRequest(req, res)
        } else {
          next()
        }
      })
    },
    configurePreviewServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api')) {
          await handleApiRequest(req, res)
        } else {
          next()
        }
      })
    }
  }
}
