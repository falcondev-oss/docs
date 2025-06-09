import { defineConfig } from 'vitepress'
import { defineConfigWithDefaults } from '../default-config'

export default defineConfigWithDefaults({
  title: 'falconDev OSS',
  description: 'Open Source Software by falconDev',
  vite: {
    server: {
      proxy: {
        '/form': {
          target: 'http://localhost:5174',
        },
        '/caps': {
          target: 'http://localhost:5175',
        },
        '/trpc-vue-query': {
          target: 'http://localhost:5176',
        },
        '/lang': {
          target: 'http://localhost:5177',
        },
        '/gha-cache-server': {
          target: 'http://localhost:5178',
        },
        '/nitro-trpc-event-handler': {
          target: 'http://localhost:5179',
        },
        '/expo-event-source-polyfill': {
          target: 'http://localhost:5180',
        },
        '/util': {
          target: 'http://localhost:5181',
        },
        '/configs': {
          target: 'http://localhost:5182',
        },
      },
    },
  },
  themeConfig: {
    logo: '/logo.svg',
  },
})
