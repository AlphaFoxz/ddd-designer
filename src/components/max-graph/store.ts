import * as action from './action'
import * as state from './state'

export function useGraphStore() {
  return {
    state,
    action,
  }
}
