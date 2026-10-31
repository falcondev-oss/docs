import type { DefaultTheme, HeadConfig, UserConfig } from 'vitepress'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import { defu } from 'defu'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import llmstxt from 'vitepress-plugin-llms'

const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Meta-ExternalAgent',
]

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
        plugins: [
          groupIconVitePlugin(),
          llmstxt({ domain: opts.url, title: opts.title, description: opts.description }),
        ],
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
      transformHead({ pageData, title, description }) {
        if (pageData.isNotFound) return

        const url = `${opts.url}/${pageData.relativePath.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '')}`
        const head: HeadConfig[] = [
          ['link', { rel: 'canonical', href: url }],
          ['meta', { property: 'og:type', content: 'website' }],
          ['meta', { property: 'og:site_name', content: opts.title }],
          ['meta', { property: 'og:title', content: title }],
          ['meta', { property: 'og:description', content: description }],
          ['meta', { property: 'og:url', content: url }],
          ['meta', { name: 'twitter:card', content: 'summary' }],
        ]
        // vitepress-plugin-llms skips the home page
        if (pageData.frontmatter.layout !== 'home')
          head.push([
            'link',
            {
              rel: 'alternate',
              type: 'text/markdown',
              href: `${opts.url}/${pageData.relativePath}`,
            },
          ])
        return head
      },
      async buildEnd({ outDir }) {
        await writeFile(
          path.join(outDir, 'robots.txt'),
          [
            ...AI_CRAWLERS.map((agent) => `User-agent: ${agent}`),
            'User-agent: *',
            'Content-Signal: search=yes, ai-input=yes, ai-train=yes',
            'Allow: /',
            '',
            `Sitemap: ${opts.url}/sitemap.xml`,
            '',
          ].join('\n'),
        )
      },
    }),
  )
}
