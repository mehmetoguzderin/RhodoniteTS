import { defineConfig } from 'tsup'
import shaderity from 'esbuild-plugin-shaderity'
import version from 'esbuild-plugin-version'

export default defineConfig({
  entry: ['src/iife.ts'],
  outDir: 'dist/iifedev',
  splitting: false,
  sourcemap: 'inline',
  clean: true,
  minify: false,
  treeshake: false,
  dts: true,
  format: ['iife'],
  globalName: 'Rn',
  noExternal: ['ktx-parse', 'shaderity', 'zstddec'],
  esbuildPlugins: [
    shaderity({
      filter: /\.(wgsl|glsl|vs|fs|vert|frag)$/
    }),
    version({
      filter: /VERSION-FILE$/
    })
  ]
})
