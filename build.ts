// Bundles the extension. fengari (Lua in JS) carries Node file/process hooks we never
// use (io library, os.getenv, loading Lua files from disk); strip them so the bundle
// passes Lumiverse's backend safety scan and card Lua can't reach the host.
import type { BunPlugin } from 'bun'

const stripNodeHooks: BunPlugin = {
  name: 'strip-node-hooks',
  setup(build) {
    build.onLoad({ filter: /node_modules[\\/](fengari|tmp|readline-sync|os-tmpdir)[\\/].*\.js$/ }, async (args) => {
      const stub = /[\\/](liolib|loadlib|fengarilib|ldblib)\.js$/.exec(args.path)
      if (stub) {
        // Unused libraries (file io, package loader, JS bridge, debug): empty tables.
        const name = { liolib: 'io', loadlib: 'package', fengarilib: 'fengari', ldblib: 'debug' }[stub[1]]
        return { contents: `const { lua_newtable } = require('./lua.js'); module.exports.luaopen_${name} = (L) => { lua_newtable(L); return 1 };`, loader: 'js' }
      }
      let text = await Bun.file(args.path).text()
      text = text
        .replace(/require\(\s*['"](?:node:)?os['"]\s*\)/g, '({ platform: () => "linux", tmpdir: () => "/tmp", homedir: () => "/", EOL: "\\n" })')
        .replace(/require\(\s*['"](?:node:)?path['"]\s*\)/g, '({ sep: "/", join: (...a) => a.join("/"), resolve: (...a) => a.join("/"), dirname: (p) => p })')
        .replace(/require\(\s*['"](?:node:)?(?:fs|child_process|tmp|readline-sync|crypto)['"]\s*\)/g, '({})')
        .replace(/\bprocess\.env\b/g, '({})')
        .replace(/\bprocess\.exit\b/g, '(() => {})')
        .replace(/\beval\s*\(/g, '(void 0, (() => { throw new Error("eval disabled") }))(')
        .replace(/\b(?:new )?Function\s*\(/g, '(() => { throw new Error("Function disabled") })(')
      return { contents: text, loader: 'js' }
    })
  },
}

const backend = await Bun.build({ entrypoints: ['src/backend.ts'], outdir: 'dist', target: 'bun', format: 'esm', naming: 'backend.js', plugins: [stripNodeHooks] })
const frontend = await Bun.build({ entrypoints: ['src/frontend.ts'], outdir: 'dist', target: 'browser', format: 'esm', naming: 'frontend.js' })
for (const r of [backend, frontend]) {
  if (!r.success) { console.error(r.logs); process.exitCode = 1 }
  for (const o of r.outputs) console.log(o.path.split('/').pop(), (o.size / 1024).toFixed(1), 'KB')
}
