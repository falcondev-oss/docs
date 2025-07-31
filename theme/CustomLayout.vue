<script setup lang="ts">
import { groupBy, prop } from 'remeda'
import { useData, useRoute } from 'vitepress'
import DefaultTheme, { VPFeatures, useSidebar } from 'vitepress/theme'
import { computed, onMounted, useTemplateRef, watch } from 'vue'

const { Layout } = DefaultTheme
const sidebar = useSidebar()

const { frontmatter: fm } = useData()
const groupedFeatures = computed(() =>
  groupBy((fm.value.groupedFeatures ?? []) as { group?: string }[], prop('group')),
)

const linkPlaceholderRef = useTemplateRef('linkPlaceholder')

// nesting `@falcondev-oss` link inside the title `a` tag leads to flickering issues
// this workaround replaces the placeholder with an `a` tag after the component is mounted
watch(
  linkPlaceholderRef,
  (linkPlaceholder) => {
    if (!linkPlaceholder) return

    const a = document.createElement('a')
    for (const attr of Object.values(linkPlaceholder.attributes)) {
      a.setAttribute(attr.name, attr.value)
    }

    a.textContent = linkPlaceholder.textContent

    linkPlaceholder.parentElement?.replaceChild(a, linkPlaceholder)
    linkPlaceholder.remove()
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <Layout>
    <template #nav-bar-title-before v-if="!sidebar.hasSidebar.value && !fm.hideRootLink">
      <div class="header-title-prefix">
        <div ref="linkPlaceholder" href="https://falcondev.io" target="_blank">@falcondev-oss</div>
        <span>/</span>
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

.header-title-prefix > a {
  transition: color 0.1s ease-in-out;
}

.header-title-prefix > a:hover {
  color: var(--vp-c-text-1);
}
</style>
