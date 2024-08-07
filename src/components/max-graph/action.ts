import {
  graph as graphRef,
  editor as editorRef,
  isReady as isReadyRef,
  undoManager as undoManagerRef,
} from './state'
import {
  Cell,
  DddGraph,
  Editor,
  DddToolbar,
  ModelXmlSerializer,
  UndoManager,
} from './define'

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
  undoManagerRef.value = new UndoManager()
}

export async function loadData() {
  const graph = checkReady()
  graph.batchUpdate(() => {
    const commandNode = createCommandNode(10, 10)
    const aggNode = createAggregateNode(10, 350)
    const eventNode = createEventNode(10, 650)
    const policy = createPolicyNode(300, 10)
    const recordModel = createRecordModelNode(300, 350)
    const systemNode = createSystemNode(300, 650)
    createEdge(commandNode, aggNode)
    createEdge(aggNode, eventNode)
    createEdge(policy, recordModel)
    createEdge(recordModel, systemNode)
  })
  graph.refresh()
}

export function createCommandNode(x: number, y: number): Cell {
  const graph = checkReady()
  const commandNode = graph.insertVertex({
    parent: graph.getDefaultParent(),
    position: [x, y],
    size: [150, 40],
    style: {
      shape: 'swimlane',
      fillColor: 'var(--ddd-bg-command-node-1)',
      fontColor: 'var(--ddd-text-base-1)',
      fontSize: 16,
    },
    value: 'Command',
  })
  graph.addBtnOverlay(commandNode)
  return commandNode
}

export function createAggregateNode(x: number, y: number): Cell {
  const graph = checkReady()
  const aggNode = graph.insertVertex({
    position: [x, y],
    size: [150, 40],
    style: {
      shape: 'swimlane',
      fillColor: 'var(--ddd-bg-aggregate-node-1)',
      fontColor: 'var(--ddd-text-base-1)',
      fontSize: 16,
    },
    value: 'Aggregate',
  })
  graph.addBtnOverlay(aggNode)
  return aggNode
}

export function createEventNode(x: number, y: number): Cell {
  const graph = checkReady()
  const eventNode = graph.insertVertex({
    position: [x, y],
    size: [150, 40],
    style: {
      shape: 'swimlane',
      fillColor: 'var(--ddd-bg-event-node-1)',
      fontColor: 'var(--ddd-text-base-1)',
      fontSize: 16,
    },
    value: 'Event',
  })
  graph.addBtnOverlay(eventNode)
  return eventNode
}

export function createPolicyNode(x: number, y: number): Cell {
  const graph = checkReady()
  const policyNode = graph.insertVertex({
    position: [x, y],
    size: [150, 40],
    style: {
      shape: 'swimlane',
      fillColor: 'var(--ddd-bg-policy-node-1)',
      fontColor: 'var(--ddd-text-base-1)',
      fontSize: 16,
    },
    value: 'Policy',
  })
  graph.addBtnOverlay(policyNode)
  return policyNode
}

export function createRecordModelNode(x: number, y: number): Cell {
  const graph = checkReady()
  const recordNode = graph.insertVertex({
    position: [x, y],
    size: [150, 40],
    style: {
      shape: 'swimlane',
      fillColor: 'var(--ddd-bg-recordmodel-node-1)',
      fontColor: 'var(--ddd-text-base-1)',
      fontSize: 16,
    },
    value: 'RecordModel',
  })
  graph.addBtnOverlay(recordNode)
  return recordNode
}

export function createSystemNode(x: number, y: number): Cell {
  const graph = checkReady()
  const sysNode = graph.insertVertex({
    position: [x, y],
    size: [150, 150],
    style: {
      shape: 'cloud',
    },
    value: 'RecordModel',
  })
  return sysNode
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

export function exportXml(): string {
  const graph = checkReady()
  return new ModelXmlSerializer(graph.model).export()
}

export function importXml(xml: string): void {
  const graph = checkReady()
  new ModelXmlSerializer(graph.model).import(xml)
}

export function undo() {
  undoManagerRef.value?.undo()
}

export function redo() {
  undoManagerRef.value?.redo()
}

function checkReady(): DddGraph {
  if (!isReadyRef.value || !graphRef.value)
    throw Error('Graph is not ready / not initialized')
  return graphRef.value!
}
