import assert from 'node:assert/strict';
import { once } from 'node:events';
import test from 'node:test';
import { prototypeInfo } from '../src/core/index.js';
import { createStaticServer } from '../tools/server.js';

test('shared core imports in Node without browser globals', () => {
  assert.equal('document' in globalThis, false);
  assert.equal(prototypeInfo.title, 'Eyes on the Universe');
});

test('local server serves the browser module graph and keeps tooling private', async (t) => {
  const server = createStaticServer();
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve(undefined));
  }));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const address = server.address();
  assert.ok(address && typeof address !== 'string');
  const base = `http://127.0.0.1:${address.port}`;

  for (const [path, type, text] of [
    ['/', 'text/html', '/src/ui/app.js'],
    ['/styles.css', 'text/css', 'font-family'],
    ['/src/ui/app.js', 'text/javascript', '../core/index.js'],
    ['/src/core/index.js', 'text/javascript', 'export const prototypeInfo'],
  ]) {
    const response = await fetch(`${base}${path}`);
    assert.equal(response.status, 200, path);
    assert.ok(response.headers.get('content-type')?.startsWith(type), path);
    assert.ok((await response.text()).includes(text), path);
  }

  for (const path of ['/package.json', '/.git/config', '/tools/server.js',
    '/node_modules/typescript/package.json', '/src/missing.js',
    '/src/%2e%2e%2fpackage.json']) {
    assert.equal((await fetch(`${base}${path}`)).status, 404, path);
  }
  const head = await fetch(base, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.equal((await fetch(base, { method: 'POST' })).status, 405);
  assert.equal((await fetch(`${base}/%ZZ`)).status, 400);
});
