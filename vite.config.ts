import path from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts()],

  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es'],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ['axios'],
    },
  },
})
