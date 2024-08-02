<script setup lang="ts">
import '@maxgraph/core/css/common.css'
import './index.scss'
import { useGraphStore } from './store'
import { computed, onMounted, ref } from 'vue'
import { supportsPassiveEvents } from 'detect-it'

//===========================初始化容器==========================
const toolbarRef = ref<HTMLDivElement>()
const containerRef = ref<HTMLDivElement>()
const graphRootRef = ref<HTMLDivElement>()
let graphStore = useGraphStore()
const isViewMode = computed(() => {
  return graphStore.state.operationMode.value === 'View'
})
onMounted(async () => {
  const contain = containerRef.value!
  await graphStore.action.init(contain, toolbarRef.value!)
  contain.addEventListener('wheel', handleZoom, {
    passive: supportsPassiveEvents,
  })
})

function handleZoom(e: WheelEvent) {
  if (e.deltaY < 0) {
    // 向上滚动，放大
    graphStore!.action.zoomIn()
  } else {
    // 向下滚动，缩小
    graphStore!.action.zoomOut()
  }
}
</script>

<template>
  <div ref="graphRootRef" class="ddd-designer-graph">
    <div ref="toolbarRef" class="ddd-designer-graph-toolbar"></div>
    <div
      ref="containerRef"
      :class="`ddd-designer-graph-container 
        ${isViewMode ? 'view-mode' : ''}
        `"
    ></div>
  </div>
</template>
