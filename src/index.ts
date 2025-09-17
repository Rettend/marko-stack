import { Elysia } from 'elysia'
import { handler } from './adapter'

const app = new Elysia()
  .mount(handler)
  .listen(3000)

// eslint-disable-next-line no-console
console.log(`Server is running on ${app.server?.url}`)
