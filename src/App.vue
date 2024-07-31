<script setup lang="ts">
import './app.scss'
import MaxGraph from '@/components/max-graph/Index.vue'
import SysMenu from '@/components/sys-menu/Index.vue'
// import * as api from './api'
import { onMounted } from 'vue'

onMounted(async () => {
  // const info = await api.get_ide_info()
  // console.warn(JSON.stringify(info))
})
</script>

<template>
  <SysMenu class="ddd-designer-menu" @contextmenu.prevent.stop></SysMenu>
  <MaxGraph class="ddd-designer-graph" @contextmenu.prevent.stop></MaxGraph>
</template>
