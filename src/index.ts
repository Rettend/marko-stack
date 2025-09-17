import type { ReadableStream } from 'node:stream/web'
import http from 'node:http'
import { Elysia } from 'elysia'
import { createServer as createViteServer } from 'vite'

const vite = await createViteServer({
  server: {
    middlewareMode: true,
  },
  appType: 'custom',
})

const app = new Elysia()
  .get('/', async () => {
    const template = (
      await vite.ssrLoadModule('/src/routes/index.marko?marko-server-entry')
    ).default
    const result = template.render()

    const { PassThrough, Readable } = await import('node:stream')
    const pass = new PassThrough()
    result.pipe(pass)
    const webStream: ReadableStream = Readable.toWeb(pass)
    // @ts-expect-error Node 18+ provides Readable.toWeb
    return new Response(webStream, {
      headers: { 'Content-Type': 'text/html' },
    })
  })

// Compose Vite's Connect middleware first, then fall back to Elysia.
const server = http.createServer(async (req, res) => {
  vite.middlewares(req, res, async () => {
    const origin = `http://${req.headers.host}`
    const url = new URL(req.url ?? '/', origin)

    const { Readable } = await import('node:stream')
    const body = req.method && (req.method === 'GET' || req.method === 'HEAD')
      ? undefined
      : (Readable.toWeb(req) as unknown as ReadableStream)

    const request = new Request(url, {
      method: req.method,
      headers: req.headers as Record<string, string>,
      body: body as any,
      // Node requires duplex when a Request has a body
      // @ts-expect-error Node/undici extension
      duplex: body ? 'half' : undefined,
    })

    const response = await app.handle(request)
    res.statusCode = response.status
    response.headers.forEach((value, key) => res.setHeader(key, value))

    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as unknown as ReadableStream)
      nodeStream.pipe(res)
    }
    else {
      const text = await response.text()
      res.end(text)
    }
  })
})

server.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('🦊 Elysia + Vite (dev) server running at http://localhost:3000')
})
