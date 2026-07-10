import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  external: ['react', 'react-dom', '@supabase/supabase-js', 'i18next', 'react-i18next'],
  clean: true,
  treeshake: true,
})
