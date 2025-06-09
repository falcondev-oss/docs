<script setup lang="ts">
import { groupBy, prop } from 'remeda'
import { useData } from 'vitepress'
import { computed } from 'vue'
import DefaultTheme, { VPFeatures } from 'vitepress/theme'

const { Layout } = DefaultTheme

const { frontmatter: fm } = useData()
const origin = import.meta.env.SSR ? '' : window.location.origin
const groupedFeatures = computed(() =>
  groupBy(
    ((fm.value['groupedFeatures'] as any[])?.map((feature) => ({
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
      <div class="header-title-prefix" v-if="!fm['hideRootLink']">
        <a href="/" target="_self">@falcondev-oss</a>
        <span style="font-size: 1.5rem">/</span>
      </div>
    </template>
    <template #home-features-after>
      <VPFeatures v-for="(features, group) of groupedFeatures" :features="features" />
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
