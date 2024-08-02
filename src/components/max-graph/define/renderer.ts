import {
  CellOverlay,
  CellRenderer,
  CellState,
  Client,
  EventObject,
  InternalEvent,
  Shape,
} from '@maxgraph/core'

export class DddNodeContentRenderer extends CellRenderer {
  installCellOverlayListeners(
    state: CellState,
    overlay: CellOverlay,
    shape: Shape
  ): void {
    super.installCellOverlayListeners(state, overlay, shape)
    InternalEvent.addListener(
      shape.node,
      Client.IS_POINTER ? 'pointerdown' : 'mousedown',
      (evt: Event) => {
        overlay.fireEvent(
          new EventObject('pointerdown', {
            event: evt,
            state,
          })
        )
      }
    )
    if (!Client.IS_POINTER && Client.IS_TOUCH) {
      InternalEvent.addListener(shape.node, 'touchstart', (evt: Event) => {
        overlay.fireEvent(
          new EventObject('pointerdown', {
            event: evt,
            state,
          })
        )
      })
    }
  }
}

export class MyCustomCellRenderer extends CellRenderer {
  installCellOverlayListeners(
    state: CellState,
    overlay: CellOverlay,
    shape: Shape
  ): void {
    super.installCellOverlayListeners(state, overlay, shape)
    InternalEvent.addListener(
      shape.node,
      Client.IS_POINTER ? 'pointerdown' : 'mousedown',
      (evt: Event) => {
        overlay.fireEvent(
          new EventObject('pointerdown', {
            event: evt,
            state,
          })
        )
      }
    )
    if (!Client.IS_POINTER && Client.IS_TOUCH) {
      InternalEvent.addListener(shape.node, 'touchstart', (evt: Event) => {
        overlay.fireEvent(
          new EventObject('pointerdown', {
            event: evt,
            state,
          })
        )
      })
    }
  }
}
