import { resolve } from 'path';
import { defineConfig } from 'vite';

// Plugin to support clean URLs in local dev server
function cleanUrlsPlugin() {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const pathname = urlObj.pathname;
        
        // Handle portfolio sub-routes: /portfolio/slug-name -> /project.html
        const parts = pathname.split('/').filter(Boolean);
        if (parts[0] === 'portfolio' && parts.length > 1) {
          req.url = '/project.html' + urlObj.search;
          next();
          return;
        }

        // If the pathname doesn't have an extension and isn't root, append .html
        if (pathname && !pathname.includes('.') && pathname !== '/' && !pathname.startsWith('/@')) {
          req.url = req.url.replace(pathname, pathname + '.html');
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
