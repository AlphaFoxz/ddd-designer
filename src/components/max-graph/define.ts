import {
  Graph,
  CellEditorHandler,
  TooltipHandler,
  SelectionCellsHandler,
  PopupMenuHandler,
  ConnectionHandler,
  SelectionHandler,
  PanningHandler,
  KeyHandler,
  InternalEvent,
  MaxToolbar,
} from '@maxgraph/core'
import { operationMode } from './state'
import { computed, nextTick } from 'vue'

export {
  Cell,
  Editor,
  MaxToolbar,
  InternalEvent,
  KeyHandler,
} from '@maxgraph/core'

export type { CellStyle } from '@maxgraph/core'

export type OperationMode = 'Edit' | 'View'

class CommandCellEditorHandler extends CellEditorHandler {
  constructor(graph: Graph) {
    super(graph)
  }
}

export class DddToolbar extends MaxToolbar {
  constructor(container: HTMLElement) {
    super(container)
  }
  bindGraph(graph: DddGraph) {
    this.addItem('编辑', '编辑', (_: MouseEvent) => {
      operationMode.value = 'Edit'
    })
    this.addItem('拖动', '拖动', (_: MouseEvent) => {
      operationMode.value = 'View'
    })
    this.addLine()
    this.addItem('复位', '复位', (_: MouseEvent) => {
      graph.zoomActual()
    })
  }
}

export class DddKeyHandler extends KeyHandler {
  keyupHandler: (evt: KeyboardEvent) => void | null
  constructor(graph: Graph, target?: Element | null) {
    super(graph, target)
    this.keyupHandler = (evt: KeyboardEvent) => {
      this.keyUp(evt)
    }
  }

  keyUp(evt: KeyboardEvent) {
    if (this.isEnabledForEvent(evt)) {
      // Cancels the editing if escape is pressed
      if (evt.keyCode === 27 /* Escape */) {
        this.escape(evt)
      }
      // Invokes the function for the keystroke
      else if (!this.isEventIgnored(evt)) {
        const boundFunction = this.getFunction(evt)

        if (boundFunction != null) {
          boundFunction(evt)
          InternalEvent.consume(evt)
        }
      }
    }
  }
}

export class DddGraph extends Graph {
  public refs = {
    operationMode: computed(() => {
      const panningHandler = this.getPlugin('PanningHandler') as PanningHandler
      const connectionHandler = this.getPlugin(
        'ConnectionHandler'
      ) as ConnectionHandler
      const tooltipHandler = this.getPlugin('TooltipHandler') as TooltipHandler
      const selectionHandler = this.getPlugin(
        'SelectionHandler'
      ) as SelectionHandler
      nextTick(() => {
        const v = operationMode.value
        console.debug('被动更新', v)
        if (v === 'Edit') {
          panningHandler.setPanningEnabled(false)
          connectionHandler.setEnabled(true)
          tooltipHandler.setEnabled(true)
          selectionHandler.setEnabled(true)
        } else if (v === 'View') {
          panningHandler.setPanningEnabled(true)
          connectionHandler.setEnabled(false)
          tooltipHandler.setEnabled(false)
          selectionHandler.setEnabled(false)
        }
      })
      return operationMode.value
    }),
  }
  constructor(container: HTMLElement) {
    super(container, undefined, [
      CommandCellEditorHandler,
      TooltipHandler,
      SelectionCellsHandler,
      PopupMenuHandler,
      ConnectionHandler,
      SelectionHandler,
      PanningHandler,
    ])

    this.setPanning(true)
    this.setConnectable(true)
    this.setGridEnabled(true)
    this.gridSize = 10
    // this.setDropEnabled(true)

    const keyStore = new DddKeyHandler(this)
    keyStore.bindKey(32, (_: KeyboardEvent) => {
      console.debug('改变模式')
      if (this.refs.operationMode.value === 'View') {
        operationMode.value = 'Edit'
      } else {
        operationMode.value = 'View'
      }
    })
  }
}
