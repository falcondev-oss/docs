import { defineConfigWithDefaults } from '../../../default-config'

export default defineConfigWithDefaults({
  title: 'GitHub Actions Cache Server',
  description:
    'Self-hosted GitHub Actions cache server written in Rust. Drop-in replacement for the GitHub cache backend: actions/cache, setup-* caches and BuildKit type=gha work unchanged on self-hosted runners.',
  port: 5178,
  repo: 'falcondev-oss/github-actions-cache-server',
  url: 'https://gha-cache-server.falcondev.io',
  config: {
    titleTemplate: ':title | Self-Hosted GitHub Actions Cache Server',
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
            {
              text: 'Metrics',
              link: '/metrics',
            },
          ],
        },
        {
          text: 'Storage Drivers',
          items: [
            {
              text: 'S3 / RustFS / MinIO / R2',
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
            {
              text: 'Azure Blob Storage',
              link: '/storage-drivers/azure-blob-storage',
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
