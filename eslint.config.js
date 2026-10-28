// @ts-check
import eslintConfig from '@falcondev-oss/configs/eslint'
import eslintPluginUnicorn from 'eslint-plugin-unicorn'

export default eslintConfig({
  nuxt: false,
  tsconfigPath: './tsconfig.json',
})
  .append({
    ignores: ['node_modules/', 'dist/', './**/.vitepress/cache/', 'pnpm-lock.yaml'],
  })
  .append({
    files: ['**/*.vue'],
    // The shared config registers unicorn for script files only.
    plugins: { unicorn: eslintPluginUnicorn },
    rules: {
      'unicorn/filename-case': ['error', { case: 'pascalCase', checkDirectories: false }],
    },
  })
  .append({
    // CSS imported after the theme re-export overrides the default theme's styles.
    files: ['**/theme/index.ts'],
    rules: {
      'import/first': 'off',
    },
  })
  .append({
    // VitePress slugifies headings differently from GitHub, e.g. `FOO_BAR` becomes `#foo-bar`.
    files: ['**/*.md'],
    rules: {
      'markdown/no-missing-link-fragments': 'off',
    },
  })
  .append({
    // Code samples evaluate expressions to show their result.
    files: ['**/*.md/**'],
    rules: {
      'unicorn/no-unused-array-method-return': 'off',
    },
  })
