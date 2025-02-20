/// <reference types="vitest" />

import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      include: [
        'src/**'
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, './index'),
      name: 'Seele',
      fileName: 'seele',
    },
    sourcemap: true,
    target: 'esnext',
    minify: false,
  },
})
