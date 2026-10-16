import { createServer } from 'node:http';
import { readFile, realpath } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
]);

/** Create the local development server without starting a listener on import. */
export function createStaticServer() {
  return createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');

    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      response.end();
      return;
    }

    try {
      const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://localhost').pathname);
      const asset = pathname === '/' ? '/index.html' : pathname;
      // Serve only the browser shell and its modules, never repository internals.
      const allowed = asset === '/index.html' || asset === '/styles.css'
        || /^\/src\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.js$/.test(asset);
      if (!allowed) {
        response.writeHead(404).end();
        return;
      }

      const filename = await realpath(resolve(projectRoot, `.${asset}`));
      if (!filename.startsWith(`${projectRoot}${sep}`)) {
        response.writeHead(404).end();
        return;
      }

      const body = await readFile(filename);
      response.writeHead(200, {
        'Content-Type': contentTypes.get(extname(filename)) ?? 'application/octet-stream',
        'Content-Length': body.length,
      });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error ? error.code : undefined;
      const status = error instanceof URIError ? 400
        : code === 'ENOENT' || code === 'ENOTDIR' ? 404 : 500;
      if (status === 500) console.error('Static file request failed:', error);
      response.writeHead(status).end();
    }
  });
}

if (import.meta.main) {
  const port = Number(process.env.PORT ?? 5173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }
  const server = createStaticServer();
  server.on('error', (error) => {
    console.error(`Could not start the local server: ${error.message}`);
    process.exitCode = 1;
  });
  server.listen(port, '127.0.0.1', () => {
    console.log(`Eyes on the Universe: http://127.0.0.1:${port}`);
  });
}
