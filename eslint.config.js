// @ts-check
import eslintConfig from '@louishaftmann/eslint-config'

export default eslintConfig({
  nuxt: false,
  tsconfigPath: './tsconfig.json',
})
  .append({
    ignores: ['node_modules/', 'dist/', './**/.vitepress/cache/', 'pnpm-lock.yaml'],
  })
  .append({
    files: ['**/*.vue'],
    rules: {
      'unicorn/filename-case': ['error', { case: 'pascalCase' }],
    },
  })
  .append({
    // CSS imported after the theme re-export overrides the default theme's styles.
    files: ['**/theme/index.ts'],
    rules: {
      'import/first': 'off',
    },
  })
