<script setup lang="ts">
import './app.scss'
import MaxGraph from '@/components/max-graph/Index.vue'
import SysMenu from '@/components/sys-menu/Index.vue'
</script>

<template>
  <SysMenu class="ddd-designer-menu" @contextmenu.prevent.stop></SysMenu>
  <MaxGraph class="ddd-designer-graph" @contextmenu.prevent.stop></MaxGraph>
</template>
