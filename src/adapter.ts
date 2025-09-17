import type { Adapter } from '@marko/run/adapter'
import baseAdapter from '@marko/run/adapter'

export default function (): Adapter {
  const base = baseAdapter()
  return {
    ...base,
    name: 'elysia-adapter',
    async viteConfig(config) {
      return await base.viteConfig?.(config)
    },
  }
}

export function handler(request: Request) {
  return import('@marko/run/router')
    .then(({ fetch }) => fetch(request, {}))
    .then(res => res || new Response(null, { status: 404 }))
}
