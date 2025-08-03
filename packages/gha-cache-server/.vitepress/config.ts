import { defineConfigWithDefaults } from '../../../default-config'

export default defineConfigWithDefaults({
  title: 'GHA Cache Server',
  description:
    "Self-hosted GitHub Actions cache server implementation. Compatible with official 'actions/cache' action",
  port: 5178,
  repo: 'falcondev-oss/github-actions-cache-server',
  url: 'https://gha-cache-server.falcondev.io',
  config: {
    themeConfig: {
      sidebar: [
        {
          text: 'Guide',
          items: [
            {
              text: 'Getting Started',
              link: '/getting-started',
            },
            // {
            //   text: 'Storage Drivers',
            //   link: '/storage-drivers',
            // },
            // {
            //   text: 'Database Drivers',
            //   link: '/database-drivers',
            // },
            {
              text: 'How it works',
              link: '/how-it-works',
            },
          ],
        },
        {
          text: 'Storage Drivers',
          items: [
            {
              text: 'S3 / MinIO',
              link: '/storage-drivers/s3',
            },
            {
              text: 'File System',
              link: '/storage-drivers/file-system',
            },
            {
              text: 'Google Cloud Storage',
              link: '/storage-drivers/google-cloud-storage',
            },
          ],
        },
        {
          text: 'Database Drivers',
          items: [
            {
              text: 'PostgreSQL',
              link: '/database-drivers/postgres',
            },
            {
              text: 'MySQL',
              link: '/database-drivers/mysql',
            },
            {
              text: 'SQLite',
              link: '/database-drivers/sqlite',
            },
          ],
        },
      ],
    },
  },
})
