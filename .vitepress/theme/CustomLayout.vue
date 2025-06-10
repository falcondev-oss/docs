<script setup lang="ts">
import { groupBy, prop } from 'remeda'
import { useData } from 'vitepress'
import DefaultTheme, { VPFeatures } from 'vitepress/theme'
import { computed } from 'vue'

const { Layout } = DefaultTheme

const { frontmatter: fm } = useData()
const origin = import.meta.env.SSR ? '' : window.location.origin
const groupedFeatures = computed(() =>
  groupBy(
    ((fm.value.groupedFeatures as any[])?.map((feature) => ({
      ...feature,
      link: origin + feature.link,
      target: '_self',
      rel: '',
      icon: {
        ...feature.icon,
        src: origin + feature.icon.src,
      },
    })) ?? []) as { group?: string }[],
    prop('group'),
  ),
)
</script>

<template>
  <Layout>
    <template #nav-bar-title-before>
      <div v-if="!fm.hideRootLink" class="header-title-prefix">
        <a href="/" target="_self">@falcondev-oss</a>
        <span style="font-size: 1.5rem">/</span>
      </div>
    </template>
    <template #home-features-after>
      <VPFeatures
        v-for="(features, group, idx) of groupedFeatures"
        :key="group"
        :features="features"
        :style="{ marginTop: idx === 0 ? 0 : '0.5rem' }"
      />
    </template>
  </Layout>
</template>

<style>
.header-title-prefix {
  display: flex;
  gap: 0.25rem;
  color: var(--vp-c-text-3);
  font-weight: 600;
  margin-right: 0.75rem;
}

.header-title-prefix > a:hover {
  text-underline-offset: 0.4rem;
  text-decoration-thickness: 0.1rem !important;
  text-decoration: underline;
}
</style>
