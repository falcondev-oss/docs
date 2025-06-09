<script setup lang="ts">
import { groupBy, prop } from 'remeda'
import { useData } from 'vitepress'
import { computed } from 'vue'
import DefaultTheme, { VPFeatures } from 'vitepress/theme'

const { Layout } = DefaultTheme

const { frontmatter: fm } = useData()

const origin = window.location.origin
console.log('origin', origin, fm.value['grouped-features'])
const groupedFeatures = computed(() =>
  groupBy(
    fm.value['grouped-features'].map((feature) => ({
      ...feature,
      link: origin + feature.link,
      target: '_self',
      rel: '',
      icon: {
        ...feature.icon,
        src: origin + feature.icon.src,
      },
    })) as { group?: string }[],
    prop('group'),
  ),
)
</script>

<template>
  <Layout>
    <template #home-features-after>
      <VPFeatures
        v-for="(features, idx) of groupedFeatures"
        :features="features"
        :style="{ marginTop: idx === 0 ? 0 : '8px' }"
      />
    </template>
  </Layout>
</template>
