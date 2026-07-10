import { resolve } from 'path';
import { defineConfig } from 'vite';

// Plugin to support clean URLs in local dev server
function cleanUrlsPlugin() {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // If the URL doesn't have an extension and isn't root, append .html
        if (req.url && !req.url.includes('.') && req.url !== '/' && !req.url.startsWith('/@')) {
          req.url += '.html';
        }
        next();
      });
    }
  }
}

export default defineConfig({
  plugins: [cleanUrlsPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        project: resolve(__dirname, 'project.html'),
        portfolio: resolve(__dirname, 'portfolio.html'),
      },
    },
  },
});
