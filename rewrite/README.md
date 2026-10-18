# Eyes on the Universe — Rewrite scaffold

Standalone web starter using TypeScript, PixiJS and HTML/CSS with Vite+.
The original prototype is separate and remains runnable from the parent directory.
See the [rewrite plan](../rewrite-plan.md) for the planned migration.

## Development

Use Node **26.12.0** and npm **12.2.0**, the current releases when scaffolded.
Node's bundled npm may be older; select the pinned Node version with your runtime
manager, then install npm 12.2.0 for that runtime if needed. Both `.node-version`
and `.nvmrc` are provided. This does not require a global Vite+ installation.

```sh
cd rewrite
npm ci
npm run dev
```

Open <http://localhost:5174>. The separate port avoids the prototype's default port.
The startup page draws a simple Pixi scene; it has no gameplay, camera controls,
saves, external assets or desktop integration yet.

```sh
npm run check       # Formatting, lint and type checks through Vite+
npm run typecheck   # TypeScript alone
npm test            # One headless parity scenario against the original core
npm run format     # Apply formatting
npm run build      # Typecheck and create dist/
npm run preview    # Serve the production build locally
```

The lockfile pins dependencies. Vite+ is installed locally and uses npm; there is
no workspace coupling to the prototype. Relative build URLs support static hosting
under a subpath. Deployment is not configured for this scaffold.

## Starting points

- `src/main.ts`: Pixi initialization, a placeholder scene and hot-reload cleanup.
- `src/style.css` and `index.html`: screen-space HTML/CSS shell.
- `vite.config.ts`: Vite+ build, lint/format checks and development server.
- `tsconfig.json`: strict TypeScript; current web typings supply Pixi's WebGPU types.

The [TypeScript core](CORE.md) now contains the prototype economy, progression,
prestige, saves and a separate diagnostics recorder. It runs without Pixi or browser
globals. The starter scene is not connected to gameplay yet. Tauri remains the
selected later desktop shell; it is not installed yet.

Tooling: [Vite+ local CLI](https://viteplus.dev/guide/local-cli),
[PixiJS quick start](https://pixijs.com/8.x/guides/getting-started/quick-start).
