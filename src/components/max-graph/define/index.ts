import icon from '/vite.svg?url'
import addIcon from '/images/add.png?url'
import {
  Graph,
  TooltipHandler,
  SelectionCellsHandler,
  PopupMenuHandler,
  ConnectionHandler,
  SelectionHandler,
  PanningHandler,
  InternalEvent,
  MaxToolbar,
  RubberBandHandler,
  Cell,
  EventObject,
  CellRenderer,
  CellState,
  EdgeHandler,
  EdgeStyleFunction,
  CellOverlay,
  ImageBox,
  Point,
  VertexParameters,
} from '@maxgraph/core'
import {
  graph as graphRef,
  isReady as isReadyRef,
  operationMode as operationModeRef,
} from '../state'
import { computed, nextTick } from 'vue'
import {
  DddCommandCellEditorHandler,
  DddEdgeHandler,
  DddKeyHandler,
} from './handler'
import { DddNodeContentRenderer } from './renderer'
import { CommandNodeCell } from './cell'

export {
  type CellStyle,
  Cell,
  Editor,
  MaxToolbar,
  InternalEvent,
  KeyHandler,
  RubberBandHandler,
  ModelXmlSerializer,
  UndoManager,
  CellOverlay,
  ImageBox,
  Point,
} from '@maxgraph/core'

export type OperationMode = 'Edit' | 'View'

export class DddToolbar extends MaxToolbar {
  constructor(container: HTMLElement) {
    super(container)
  }
  bindGraph(graph: DddGraph) {
    this.addItem('编辑', '编辑', (_: MouseEvent) => {
      operationModeRef.value = 'Edit'
    })
    this.addItem('拖动', '拖动', (_: MouseEvent) => {
      operationModeRef.value = 'View'
    })
    this.addLine()
    this.addItem('复位', icon, (_: MouseEvent) => {
      graph.zoomActual()
    })
  }
}

export class DddGraph extends Graph {
  public refs = {
    operationMode: computed(() => {
      nextTick(() => {
        this.updateOperationMode(operationModeRef.value)
      })
      return operationModeRef.value
    }),
  }
  constructor(container: HTMLElement) {
    super(container, undefined, [
      DddCommandCellEditorHandler,
      TooltipHandler,
      SelectionCellsHandler,
      PopupMenuHandler,
      ConnectionHandler,
      SelectionHandler,
      PanningHandler,
      RubberBandHandler,
    ])

    this.setPanning(true)
    this.setConnectable(true)
    this.setGridEnabled(true)
    this.gridSize = 10
    // this.setDropEnabled(true)
    this.updateOperationMode()

    const keyStore = new DddKeyHandler(this)
    keyStore.bindKey(32, (_: KeyboardEvent) => {
      console.debug('快捷键：改变模式')
      if (this.refs.operationMode.value === 'View') {
        operationModeRef.value = 'Edit'
      } else {
        operationModeRef.value = 'View'
      }
    })
    this.addListener(
      InternalEvent.DOUBLE_CLICK,
      (_: Graph, event: EventObject) => {
        const cell = event.getProperty('cell') as Cell
        console.debug('双鸡cell', cell)
      }
    )
  }

  updateOperationMode(v?: OperationMode) {
    if (!v) v = operationModeRef.value
    const panningHandler = this.getPlugin('PanningHandler') as PanningHandler
    const connectionHandler = this.getPlugin(
      'ConnectionHandler'
    ) as ConnectionHandler
    const tooltipHandler = this.getPlugin('TooltipHandler') as TooltipHandler
    const selectionHandler = this.getPlugin(
      'SelectionHandler'
    ) as SelectionHandler
    const rubberBandHandler = this.getPlugin(
      'RubberBandHandler'
    ) as RubberBandHandler
    const selectionCellsHandler = this.getPlugin(
      'SelectionCellsHandler'
    ) as SelectionCellsHandler
    console.debug('更新操作模式', v)
    if (v === 'Edit') {
      // panningHandler.setPanningEnabled(false)
      panningHandler.useLeftButtonForPanning = false
      connectionHandler.setEnabled(true)
      tooltipHandler.setEnabled(true)
      selectionHandler.setEnabled(true)
      rubberBandHandler.setEnabled(true)
      selectionCellsHandler.setEnabled(true)
    } else if (v === 'View') {
      this.clearSelection()
      // panningHandler.setPanningEnabled(true)
      panningHandler.useLeftButtonForPanning = true
      connectionHandler.setEnabled(false)
      tooltipHandler.setEnabled(false)
      selectionHandler.setEnabled(false)
      rubberBandHandler.setEnabled(false)
      selectionCellsHandler.setEnabled(false)
    }
  }

  override createCellRenderer(): CellRenderer {
    return new DddNodeContentRenderer()
  }

  override createEdgeHandler(
    state: CellState,
    edgeStyle?: EdgeStyleFunction | null
  ): EdgeHandler {
    return new DddEdgeHandler(state, edgeStyle)
  }

  override addCellOverlay = (cell: Cell, overlay: CellOverlay): CellOverlay => {
    return super.addCellOverlay(cell, overlay)
  }

  insertCommandCell(params: VertexParameters): CommandNodeCell {
    return super.insertVertex(params)
  }

  addBtnOverlay(targetCell: Cell): void {
    const addOverlay = new CellOverlay(
      new ImageBox(addIcon, 24, 24),
      '添加行',
      undefined,
      undefined,
      new Point(0, 0)
    )
    addOverlay.cursor = 'hand'
    addOverlay.addListener(
      InternalEvent.CLICK,
      (_sender: CellOverlay, _event: MouseEvent) => {
        insertNodeContent(targetCell, '')
      }
    )
    this.addCellOverlay(targetCell, addOverlay)
  }
}

export function insertNodeContent(parent: Cell, text?: string): Cell {
  const graph = checkReady()
  const children = parent.children
  const content = graph.insertVertex({
    parent,
    position: [0, 40 + children.length * 20],
    size: [150, 20],
    style: {
      fillColor: 'none',
      fontSize: 16,
      overflow: 'scroll',
      deletable: true,
    },
    value: text,
  })
  return content
}

export function removeNodeContent(parent: Cell, index: number): boolean {
  const graph = checkReady()
  const children = parent.children
  let n: Cell | null = null
  for (const i in children) {
    const v = children[i]
    if (n) {
      v.geometry?.translate(0, -20)
      continue
    }
    if (parseInt(i) === index) {
      n = v
    }
  }
  if (n) {
    graph.removeCells([n])
  }
  graph.setAutoSizeCells(true)
  return n !== null
}

function checkReady(): DddGraph {
  if (!isReadyRef.value || !graphRef.value)
    throw Error('Graph is not ready / not initialized')
  return graphRef.value!
}
