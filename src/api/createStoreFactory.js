export default function createStoreFactory(applyPatchFunction) {
    return function createStore(state) {
        const listeners = new Map()

        function getState(filter) {
            const { patch } = applyPatchFunction({}, state, filter)
            return patch
        }

        function subscribe(listener, filter) {
            return listeners.set(listener, filter)
        }

        function unsubscribe(listener) {
            return listeners.delete(listener)
        }

        function applyPatch(patch) {
            const returns = []
            const { object, unpatch, mutations } = applyPatchFunction(
                state,
                patch
            )
            listeners.forEach((filter, listener) => {
                returns.push({ listener, patch: object, unpatch, mutations })
            })
            return returns
        }

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
