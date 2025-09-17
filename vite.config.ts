import marko from '@marko/run/vite'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'
import elysiaAdapter from './src/adapter'

export default defineConfig({
  plugins: [
    marko({ adapter: elysiaAdapter() }),
    UnoCSS(),
  ],
})
