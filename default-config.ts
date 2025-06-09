import { type DefaultTheme, defineConfig, type UserConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { defu } from 'defu'

export function defineConfigWithDefaults(config: UserConfig<DefaultTheme.Config>) {
  return defu(
    config,
    defineConfig({
      outDir: new URL('./dist' + (config.base ?? ''), import.meta.url).pathname,
      vite: {
        // @ts-expect-error plugin type
        plugins: [groupIconVitePlugin()],
      },
      markdown: {
        config(md) {
          md.use(groupIconMdPlugin)
        },
      },
    }),
  )
}
