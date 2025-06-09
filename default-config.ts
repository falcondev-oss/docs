import { type DefaultTheme, defineConfig, type UserConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { defu } from 'defu'

export function defineConfigWithDefaults(config: UserConfig<DefaultTheme.Config>) {
  return defu(
    config,
    defineConfig({
      vite: {
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
