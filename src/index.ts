import { routerMiddleware } from '@marko/run-adapter-node/middleware'
import { Hono } from 'hono'

// console.log(`Server is running on ${app.server?.url}`)

const app = new Hono()

app.use('*', routerMiddleware())

export default app
