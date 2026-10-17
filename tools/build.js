import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Publish the browser shell and modules, matching the development server's assets.
const root = new URL('../', import.meta.url);
const output = new URL('dist/', root);
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const asset of ['index.html', 'styles.css', 'src']) {
  await cp(new URL(asset, root), new URL(asset, output), { recursive: true });
}
console.log(`Static game built at ${fileURLToPath(output)}`);
