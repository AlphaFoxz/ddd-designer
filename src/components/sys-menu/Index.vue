<script setup lang="ts">
import './index.scss'
import MegaMenu from 'primevue/megamenu'
import { useGraphStore } from '../max-graph/store'
import { onMounted, reactive, ref } from 'vue'
import * as api from '@/api'

const graphStore = useGraphStore()
const vscodeDisabled = ref(true)
const vsDisabled = ref(true)
const ideaDisabled = ref(true)
const items = reactive([
  {
    label: 'undo',
    command: (_: MouseEvent) => {
      graphStore.action.undo()
    },
  },
  {
    label: 'redo',
    command: (_: MouseEvent) => {
      graphStore.action.redo()
    },
  },
  {
    label: '切换IDE',
    items: [
      [
        {
          label: '微软',
          items: [
            {
              label: 'Visual Studio',
              icon: 'pi pi-fw pi-desktop',
              disabled: vscodeDisabled,
            },
            { label: 'VSCode', disabled: vsDisabled },
          ],
        },
      ],
      [
        {
          label: 'JetBrains',
          items: [{ label: 'IDEA', disabled: ideaDisabled }],
        },
      ],
    ],
  },
  {
    label: '加载',
    command: (_: MouseEvent) => {
      graphStore.action.loadData()
    },
  },
])

onMounted(async () => {
  const info = await api.get_ide_info()
  vscodeDisabled.value = !info.includes('Code.exe')
  ideaDisabled.value = !info.includes('idea64.exe')
  vsDisabled.value = !info.includes('devenv.exe')
})
</script>

<template>
  <div><MegaMenu :model="items"></MegaMenu></div>
</template>
