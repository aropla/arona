import { defineConfig } from 'vite'
import UnoCSS from 'unocss/vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import glsl from 'vite-plugin-glsl'

// https://vite.dev/config/
export default defineConfig(() => {
  return {
    plugins: [
      UnoCSS(),
      react(),
      glsl()
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@app': path.resolve(__dirname, './src/app'),
        '@arona': path.resolve(__dirname, './src/app/arona'),
        '@shaders': path.resolve(__dirname, './src/shaders'),
        '@utils': path.resolve(__dirname, './src/utils'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@mocks': path.resolve(__dirname, './src/mocks'),
      },
    },
    test: {
      globals: true,
      coverage: {
        include: [
          'src/app/seele/**'
        ],
      },
    },
  }
})
