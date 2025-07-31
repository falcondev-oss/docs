import { defu } from 'defu'
import { type DefaultTheme, defineConfig, type UserConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'

export function defineConfigWithDefaults(opts: {
  title: string
  description: string
  url: string
  port: number
  /**
   * Short format, e.g. `falcondev-oss/caps`
   */
  repo: string
  config: UserConfig<DefaultTheme.Config>
}) {
  return defu(
    opts.config,
    defineConfig({
      title: opts.title,
      description: opts.description,
      themeConfig: {
        socialLinks: [{ icon: 'github', link: `https://github.com/${opts.repo}` }],
        logo: '/logo.svg',
      },
      outDir: 'dist',
      cleanUrls: true,
      vite: {
        server: {
          port: opts.port,
        },
        plugins: [groupIconVitePlugin()],
        build: {
          minify: false,
        },
      },
      sitemap: {
        hostname: opts.url,
      },
      markdown: {
        config(md) {
          md.use(groupIconMdPlugin)
        },
      },
    }),
  )
}
