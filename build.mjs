// Build + dev server using esbuild only (no Vite). `npm run build` -> dist/, `npm run dev` -> http://localhost:5173
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';

const root = path.dirname(new URL(import.meta.url).pathname);
const dist = path.join(root, 'dist');
const serve = process.argv.includes('--serve');
const SITE_URL = (process.env.VITE_SITE_URL || 'https://www.belyn.in').replace(/\/$/, '');

// Expose VITE_* variables to the client bundle (public values only, never secrets).
const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => k.startsWith('VITE_')));
env.VITE_SITE_URL = SITE_URL;

const copyDir = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  for (const f of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, f.name), b = path.join(to, f.name);
    f.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
};

async function writeStatic(meta) {
  copyDir(path.join(root, 'public'), dist);
  const outputs = Object.keys(meta.outputs);
  const js = outputs.find((o) => o.endsWith('.js'));
  const css = outputs.find((o) => o.endsWith('.css'));
  const rel = (o) => '/' + path.relative(dist, path.join(root, o)).replace(/\\/g, '/');
  let html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  html = html.replaceAll('%SITE_URL%', SITE_URL).replace('%JS%', rel(js)).replace('%CSS%', rel(css));
  fs.writeFileSync(path.join(dist, 'index.html'), html);

  // robots + sitemap (slugs read from the product data file)
  const src = fs.readFileSync(path.join(root, 'src/data/products.ts'), 'utf8');
  const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1]);
  const pages = ['', '/shop', '/story', '/contact', ...slugs.map((s) => '/product/' + s)];
  const sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
    .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
    .join('\n')}\n</urlset>\n`;
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), sm);
  fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /checkout\nSitemap: ${SITE_URL}/sitemap.xml\n`);
}

const opts = {
  entryPoints: [path.join(root, 'src/main.tsx')],
  bundle: true,
  minify: !serve,
  sourcemap: serve,
  target: 'es2020',
  format: 'esm',
  jsx: 'automatic',
  outdir: path.join(dist, 'assets'),
  entryNames: serve ? 'app' : 'app-[hash]',
  metafile: true,
  logLevel: 'info',
  define: {
    'process.env.NODE_ENV': serve ? '"development"' : '"production"',
    __ENV__: JSON.stringify(env),
  },
  external: ['/fonts/*', '/images/*'],
  plugins: [
    {
      name: 'static',
      setup(b) {
        b.onStart(() => {
          if (!serve) fs.rmSync(dist, { recursive: true, force: true });
          fs.mkdirSync(dist, { recursive: true });
        });
        b.onEnd(async (r) => {
          if (r.metafile) await writeStatic(r.metafile);
        });
      },
    },
  ],
};

if (!serve) {
  await esbuild.build(opts);
  console.log('Built to dist/');
} else {
  const ctx = await esbuild.context(opts);
  await ctx.watch();
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.xml': 'text/xml', '.txt': 'text/plain', '.map': 'application/json' };
  const port = Number(process.env.PORT) || 5173;
  http
    .createServer((req, res) => {
      const url = decodeURIComponent((req.url || '/').split('?')[0]);
      let file = path.join(dist, url);
      if (!file.startsWith(dist) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(dist, 'index.html');
      res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' });
      fs.createReadStream(file).pipe(res);
    })
    .listen(port, () => console.log(`Dev server: http://localhost:${port}`));
}
