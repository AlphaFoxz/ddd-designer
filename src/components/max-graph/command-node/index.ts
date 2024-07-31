import { GraphDataModel, Cell } from '@maxgraph/core'
import { h, render } from 'vue'
import CommandNode from './CommandNode.vue'

export class CommandNodeDataModel extends GraphDataModel {
  constructor(root?: Cell) {
    super(root)
  }
}

export function createCommandNodeElement() {
  const obj = document.createElement('div')
  const comp = h(CommandNode)
  render(comp, obj)
  return obj
}
