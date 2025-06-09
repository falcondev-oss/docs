import { defineConfigWithDefaults } from '../../../default-config'

export default defineConfigWithDefaults({
  title: 'nitro-trpc-event-handler',
  description:
    'Type-safe capability-based access control library for fine-grained permissions and authorization',
  base: '/nitro-trpc-event-handler',
  vite: {
    server: {
      port: 5179,
    },
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Guide', link: '/guide' },
      { text: 'Examples', link: '/examples' },
    ],

    sidebar: [
      {
        text: 'Getting Started',
        link: '/getting-started',
      },
      {
        text: 'Guide',
        items: [
          {
            text: 'Basic Concepts',
            link: '/guide/basic-concepts',
          },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/falcondev-oss/caps' }],
    logo: '/logo.svg',
  },
})
