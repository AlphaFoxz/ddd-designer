import {
  graph as graphRef,
  editor as editorRef,
  isReady as isReadyRef,
} from './state'
import { Cell, DddGraph, Editor, DddToolbar } from './define'
import { createCommandNodeElement } from './command-node'

export async function init(
  container: HTMLElement,
  toolbarContainer: HTMLElement
) {
  //初始化图形容器
  const graph = new DddGraph(container)
  graphRef.value = graph
  editorRef.value = new Editor(container)
  //绑定工具栏
  const toolbar = new DddToolbar(toolbarContainer)
  toolbar.bindGraph(graph)
  //加载数据
  isReadyRef.value = true
  await loadData()
}

export async function loadData() {
  const graph = checkReady()
  graph.batchUpdate(() => {
    const commandNode = createCommandNode(10, 10)
    const aggNode = createAggregateNode(10, 350)
    const eventNode = createEventNode(10, 650)
    createEdge(commandNode, aggNode)
    createEdge(aggNode, eventNode)
  })
  graph.refresh()
  graph.zoomActual()
}

export function createCommandNode(x: number, y: number): Cell {
  const graph = checkReady()
  const value = createCommandNodeElement()
  const cell = graph.insertVertex({
    parent: graph.getDefaultParent(),
    position: [x, y],
    size: [150, 150],
    value,
  })
  value.addEventListener('click', () => {
    alert('click')
  })
  return cell
}

export function createAggregateNode(x: number, y: number): Cell {
  const graph = checkReady()
  return graph.insertVertex({
    position: [x, y],
    size: [150, 150],
    value: 'Aggregate',
  })
}

export function createEventNode(x: number, y: number): Cell {
  const graph = checkReady()
  return graph.insertVertex({
    position: [x, y],
    size: [150, 150],
    value: 'Event',
  })
}

export function createEdge(from: Cell, to: Cell): Cell {
  const graph = checkReady()
  return graph.insertEdge({
    parent: graph.getDefaultParent(),
    source: from,
    target: to,
    // value: 'edge',
    style: {
      edgeStyle: 'orthogonalEdgeStyle',
      rounded: true,
    },
  })
}

export function zoomActual() {
  const graph = checkReady()
  graph.zoomActual()
}

export function zoomIn(e?: WheelEvent) {
  const graph = checkReady()
  if (!e) {
    graph.zoomIn()
  } else {
    const factor = graph.zoomFactor
    console.warn(factor)
    graph.zoom(factor)
  }
  graph.refresh()
}

export function zoomOut(e?: WheelEvent) {
  const graph = checkReady()
  if (!e) {
    graph.zoomOut()
  } else {
    const factor = graph.zoomFactor
    console.warn(factor)
    graph.zoomTo(1)
  }
  graph.refresh()
}

export function refresh() {
  const graph = checkReady()
  setTimeout(() => {
    // TODO 解决edge不渲染的问题
    graph.refresh()
  }, 10)
}

function checkReady(): DddGraph {
  if (!isReadyRef.value) throw Error('Graph is not ready / not initialized')
  return graphRef.value!
}
