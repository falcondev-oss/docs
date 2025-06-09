// @ts-check
import eslintConfig from '@louishaftmann/eslint-config'
import tanstackQueryPlugin from '@tanstack/eslint-plugin-query'

export default eslintConfig({
  nuxt: true,
  tsconfigPath: './tsconfig.json',
})
  .append(tanstackQueryPlugin.configs['flat/recommended'])
  .append({
    ignores: [
      'node_modules/',
      'dist/',
      '.nuxt/',
      '.nitro/',
      '.output/',
      '.temp/',
      '.data/',
      'drizzle/',
      'pnpm-lock.yaml',
    ],
  })