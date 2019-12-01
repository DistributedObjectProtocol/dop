import forEachObject from '../util/forEachObject'
import { mergeMutator } from '../util/merge'

function createStore(state) {
    const listeners = new Map()

    function subscribe(listener, filter) {
        const state_copy = {}
        forEachObject(
            state,
            ({ origin, destiny, prop, path }) => {
                return typeof filter !== 'function' ||
                    filter({ origin, destiny, prop, path }) === true
                    ? mergeMutator({ origin, destiny, prop })
                    : false
            },
            state_copy
        )

        listeners.set(listener, filter)

        return state_copy
    }

    function applyPatch(patch) {}

    function unsubscribe(listener) {}

    return {
        state,
        listeners,
        subscribe,
        applyPatch,
        unsubscribe
    }
}

export default createStore
