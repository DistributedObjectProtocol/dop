export default function createStoreFactory(applyPatchFunction) {
    return function createStore(state) {
        const listeners = new Map()

        function getState(filter) {
            const state_copy = {}
            applyPatchFunction(state_copy, state, filter)
            return state_copy
        }

        function subscribe(listener, filter) {
            listeners.set(listener, filter)
        }

        function applyPatch(patch) {}

        function unsubscribe(listener) {}

        return {
            state,
            listeners,
            getState,
            subscribe,
            applyPatch,
            unsubscribe
        }
    }
}
