/**
 * Every public, non-archived falcondev-oss project worth listing.
 * The `skin` mirrors the home page of the project, so a card looks like a small copy of it.
 */

type Base = {
  /** repo name in the falcondev-oss org */
  repo: string
  name: string
  group: 'Libraries' | 'Self-hosted' | 'Tooling'
  /** one line for dense lists */
  summary: string
  /** shell line shown in the card */
  command: string
}

type Skin =
  /** Starlight sites with their own landing page and animation, rendered by a card of their own */
  | { skin: 'gha-cache-server' | 'lang' }
  /** VitePress default theme sites: gradient name, bold text, gray tagline, glowing logo */
  | { skin: 'vitepress'; text: string; tagline: string; brand: string }
  /** no site yet: the GitHub README is the home page */
  | { skin: 'readme'; lede: string }

export type Project = Base & Skin & { url: string; logo: string | undefined }
export type Group = Project['group']

const site = (subdomain: string) =>
  ({ url: `https://${subdomain}.falcondev.io`, logo: `https://${subdomain}.falcondev.io/logo.svg` }) as const
const readme = (repo: string) => ({ url: `https://github.com/falcondev-oss/${repo}`, logo: undefined }) as const

export const projects = [
  {
    repo: 'github-actions-cache-server',
    name: 'GitHub Actions Cache Server',
    group: 'Self-hosted',
    summary: 'Self-hosted cache for GitHub Actions, written in Rust',
    command: 'docker run ghcr.io/falcondev-oss/github-actions-cache-server',
    skin: 'gha-cache-server',
    ...site('gha-cache-server'),
  },
  {
    repo: 'lang',
    name: 'lang',
    group: 'Libraries',
    summary: 'Type-safe i18n where the English text is the key',
    command: 'pnpm add @falcondev-oss/lang-core',
    skin: 'lang',
    ...site('lang'),
  },
  {
    repo: 'workflow',
    name: 'Workflow',
    group: 'Libraries',
    summary: 'Durable, type-safe queue workers on Redis',
    command: 'pnpm add @falcondev-oss/workflow',
    skin: 'vitepress',
    text: 'Durable, type-safe queue workers',
    tagline: 'Steps are memoized in Redis, so a retried job replays instead of re-running',
    brand: 'oklch(72.3% 0.219 149.579)',
    ...site('workflow'),
  },
  {
    repo: 'form',
    name: 'Form',
    group: 'Libraries',
    summary: 'Type-safe, framework agnostic form state',
    command: 'pnpm add @falcondev-oss/form-vue',
    skin: 'readme',
    lede: 'Type-safe, framework agnostic form state built on @vue/reactivity, for Vue and React.',
    ...readme('form'),
  },
  {
    repo: 'caps',
    name: 'Caps',
    group: 'Libraries',
    summary: 'Access control logic with generator functions',
    command: 'pnpm add @falcondev-oss/caps',
    skin: 'vitepress',
    text: 'Type-safe access control made simple',
    tagline: 'Model complex authorization logic with generator functions',
    brand: 'oklch(70.4% 0.14 182.503)',
    ...site('caps'),
  },
  {
    repo: 'trpc-vue-query',
    name: 'tRPC Vue Query',
    group: 'Libraries',
    summary: 'TanStack Vue Query client for tRPC',
    command: 'pnpm add @falcondev-oss/trpc-vue-query',
    skin: 'readme',
    lede: 'Fully type-safe composables and helpers for tRPC with TanStack Vue Query.',
    ...readme('trpc-vue-query'),
  },
  {
    repo: 'trpc-typed-form-data',
    name: 'trpc-typed-form-data',
    group: 'Libraries',
    summary: 'Type-safe FormData and file uploads for tRPC',
    command: 'pnpm add @falcondev-oss/trpc-typed-form-data',
    skin: 'readme',
    lede: 'Type-safe FormData and file uploads through tRPC, validated with Standard Schema.',
    ...readme('trpc-typed-form-data'),
  },
  {
    repo: 'expo-event-source-polyfill',
    name: 'expo-event-source-polyfill',
    group: 'Libraries',
    summary: 'EventSource for Expo on top of expo/fetch',
    command: 'pnpm add @falcondev-oss/expo-event-source-polyfill',
    skin: 'readme',
    lede: 'EventSource for Expo on top of expo/fetch. Streams, no polling.',
    ...readme('expo-event-source-polyfill'),
  },
  {
    repo: 'shopware-docker',
    name: 'Shopware Docker',
    group: 'Self-hosted',
    summary: 'Production Shopware 6 on Docker Swarm',
    command: 'docker pull ghcr.io/falcondev-oss/shopware:6.7',
    skin: 'readme',
    lede: 'Production Shopware 6 image and stack: FrankenPHP, Valkey, queue workers and scheduler.',
    ...readme('shopware-docker'),
  },
  {
    repo: 'bao-run',
    name: 'bao-run',
    group: 'Self-hosted',
    summary: 'Run a command with secrets from OpenBao',
    command: 'bao-run -- node server/index.mjs',
    skin: 'readme',
    lede: 'Run a command with secrets from OpenBao, like infisical run. No dependencies.',
    ...readme('bao-run'),
  },
  {
    repo: 'shareflare-nano',
    name: 'shareflare-nano',
    group: 'Self-hosted',
    summary: 'Token-protected file sharing on Cloudflare R2',
    command: 'curl --data-binary @photo.jpg -H "Authorization: Bearer $TOKEN"',
    skin: 'readme',
    lede: 'Tiny token-protected file sharing on one Cloudflare Worker and one R2 bucket.',
    ...readme('shareflare-nano'),
  },
  {
    repo: 'configs',
    name: 'configs',
    group: 'Tooling',
    summary: 'Our configs for ESLint, Prettier, TypeScript and more',
    command: 'pnpm add -D @falcondev-oss/configs',
    skin: 'readme',
    lede: 'Our configs for ESLint, Prettier, TypeScript and commitlint, plus a CLI to set up a monorepo.',
    ...readme('configs'),
  },
  {
    repo: 'nuxt-layers',
    name: 'nuxt-layers',
    group: 'Tooling',
    summary: 'Nuxt layers with helpers, components and plugins',
    command: 'pnpm add @falcondev-oss/nuxt-layers-base',
    skin: 'readme',
    lede: 'Nuxt layers with our helpers, components and plugins.',
    ...readme('nuxt-layers'),
  },
  {
    repo: 'skills',
    name: 'skills',
    group: 'Tooling',
    summary: 'Agent skills for commits, PRs, reviews and our libraries',
    command: 'npx skills add falcondev-oss/skills -g',
    skin: 'readme',
    lede: 'Agent skills for conventional commits, PRs, reviews and our libraries.',
    ...readme('skills'),
  },
] as const satisfies readonly Project[]

export const groups = ['Libraries', 'Self-hosted', 'Tooling'] as const satisfies readonly Group[]

export type GitHubStats = { stars: number; pushedAt: Date; language: string | undefined }

/**
 * Stars and last push for every repo, from one GitHub API call at build time.
 * Best effort: the numbers are decoration, a failed request just hides them.
 */
export async function fetchStats(): Promise<Map<string, GitHubStats>> {
  const token = process.env.GITHUB_TOKEN
  const response = await fetch('https://api.github.com/orgs/falcondev-oss/repos?per_page=100&type=public', {
    headers: token ? { authorization: `Bearer ${token}` } : {},
    signal: AbortSignal.timeout(5000),
  }).catch(() => undefined)
  if (!response?.ok) return new Map()

  const repos = (await response.json()) as {
    name: string
    stargazers_count: number
    pushed_at: string
    language: string | null
  }[]
  return new Map(
    repos.map((r) => [
      r.name,
      { stars: r.stargazers_count, pushedAt: new Date(r.pushed_at), language: r.language ?? undefined },
    ]),
  )
}
