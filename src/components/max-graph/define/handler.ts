import {
  Cell,
  CellEditorHandler,
  CellState,
  EdgeHandler,
  EdgeStyleFunction,
  Graph,
  InternalEvent,
  InternalMouseEvent,
  KeyHandler,
} from '@maxgraph/core'

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

export class DddCommandCellEditorHandler extends CellEditorHandler {
  constructor(graph: Graph) {
    super(graph)
  }
}

export class DddEdgeHandler extends EdgeHandler {
  constructor(state: CellState, _?: EdgeStyleFunction | null) {
    super(state)
  }
  connect(
    edge: Cell,
    terminal: Cell,
    isSource: boolean,
    isClone: boolean,
    me: InternalMouseEvent
  ): Cell {
    return super.connect(edge, terminal, isSource, isClone, me)
  }
}
