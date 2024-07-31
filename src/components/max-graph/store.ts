import * as operation from './operation'
import * as state from './state'

export function useGraphStore() {
  return {
    state,
    operation,
  }
}
