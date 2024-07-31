<script setup lang="ts">
import './index.scss'
import MegaMenu from 'primevue/megamenu'
import { useGraphStore } from '../max-graph/store'
import { ref } from 'vue'

const graphStore = useGraphStore()
const items = ref([
  {
    label: '加载',
    root: true,
    command: (e: MouseEvent) => {
      graphStore.operation.loadData()
    },
  },
])
</script>

<template>
  <div><MegaMenu :model="items"></MegaMenu></div>
</template>
