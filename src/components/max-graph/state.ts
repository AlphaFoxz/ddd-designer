import { ref } from 'vue'
import { DddGraph, Editor } from './define'
import type { OperationMode } from './define'

export const graph = ref<DddGraph>()
export const editor = ref<Editor>()
export const isReady = ref(false)
export const operationMode = ref<OperationMode>('Edit')
