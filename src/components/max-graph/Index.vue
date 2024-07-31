<script setup lang="ts">
import '@maxgraph/core/css/common.css'
import './index.scss'
import { useGraphStore } from './store'
import { computed, nextTick, onMounted, ref } from 'vue'
import { supportsPassiveEvents } from 'detect-it'

//===========================初始化容器==========================
const toolbarRef = ref<HTMLDivElement>()
const containerRef = ref<HTMLDivElement>()
const graphRootRef = ref<HTMLDivElement>()
let graphStore = useGraphStore()
const isDragging = computed(() => {
  console.debug('isDragging', graphStore.state.operationMode.value)
  nextTick(() => {
    console.debug('isDragging', graphStore.state.operationMode.value)
  })
  return graphStore.state.operationMode.value === 'View'
})
onMounted(async () => {
  const contain = containerRef.value!
  await graphStore.operation.init(contain, toolbarRef.value!)
  contain.addEventListener('wheel', handleZoom, {
    passive: supportsPassiveEvents,
  })
})

function handleZoom(e: WheelEvent) {
  if (e.deltaY < 0) {
    // 向上滚动，放大
    graphStore!.operation.zoomIn()
  } else {
    // 向下滚动，缩小
    graphStore!.operation.zoomOut()
  }
}
</script>

<template>
  <div ref="graphRootRef" class="ddd-designer-graph">
    <div ref="toolbarRef" class="ddd-designer-graph-toolbar"></div>
    <div
      ref="containerRef"
      :class="`ddd-designer-graph-container 
        ${isDragging ? 'dragging' : ''}
        `"
    ></div>
  </div>
</template>
