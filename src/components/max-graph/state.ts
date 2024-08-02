import { ref } from 'vue'
import { DddGraph, Editor, UndoManager } from './define'
import type { OperationMode } from './define'

export const graph = ref<DddGraph>()
export const undoManager = ref<UndoManager>()
export const editor = ref<Editor>()
export const isReady = ref(false)
export const operationMode = ref<OperationMode>('View')
export const fontSize = ref(16)
