import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/index.html'),
        order: path.resolve(__dirname, 'src/order.html'),
        admin: path.resolve(__dirname, 'src/admin.html'),
        privacy: path.resolve(__dirname, 'src/privacy.html'),
        terms: path.resolve(__dirname, 'src/terms.html'),
      },
    },
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  appType: 'mpa',
  plugins: [
    {
      name: 'clean-urls',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const clean = {
            '/order': '/order.html',
            '/admin': '/admin.html',
            '/privacy': '/privacy.html',
            '/terms': '/terms.html',
          };
          if (clean[req.url]) {
            req.url = clean[req.url];
          }
          next();
        });
      },
    },
  ],
})