import { defineConfig } from 'tsup';

/**
 * The page script: `src/page/main.ts` and what it imports, bundled for the browser as one ES
 * module at `dist/app.js`, which the editor's server reads at start and serves at `/app.js`.
 * The workspace's own tsconfig supplies the DOM lib; nothing here is a library build.
 */
export default defineConfig({
  entry: { app: 'src/page/main.ts' },
  format: ['esm'],
  platform: 'browser',
  target: 'es2022',
  outDir: 'dist',
  bundle: true,
  splitting: false,
  treeshake: true,
  sourcemap: true,
  minify: false,
  dts: false,
  clean: true,
  tsconfig: './tsconfig.json',
});
