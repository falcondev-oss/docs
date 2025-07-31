import { defineConfigWithDefaults } from '../../../default-config'

export default defineConfigWithDefaults({
  repo: 'falcondev-oss/caps',
  port: 5175,
  title: 'Caps',
  url: 'https://caps.falcondev.io',
  description:
    'Type-safe capability-based access control library for fine-grained permissions and authorization',
  config: {
    themeConfig: {
      sidebar: [
        {
          text: 'Getting Started',
          link: '/getting-started',
        },
      ],
    },
  },
})
