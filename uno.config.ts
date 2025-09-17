import { defineConfig } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|vine.ts|mdx?|astro|elm|php|phtml|html|marko)($|\?)/,
      ],
    },
  },
})
