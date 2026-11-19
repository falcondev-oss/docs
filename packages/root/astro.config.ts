import starlight from '@astrojs/starlight'
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://falcondev.io',
  trailingSlash: 'never',
  server: { port: 5173, host: true },
  devToolbar: { enabled: false },
  integrations: [
    starlight({
      title: 'falconDev OSS',
      description:
        'Open-source software by falconDev: type-safe TypeScript libraries and self-hosted tools.',
      logo: { src: './src/assets/logo.svg' },
      favicon: '/logo.svg',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/falcondev-oss' }],
      customCss: [
        '@fontsource-variable/geist',
        '@fontsource-variable/geist-mono',
        '@fontsource-variable/inter',
        './src/styles/theme.css',
      ],
      components: {
        PageTitle: './src/components/PageTitle.astro',
      },
      pagefind: false,
    }),
  ],
})
