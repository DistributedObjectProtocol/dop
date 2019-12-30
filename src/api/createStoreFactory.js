import merge from '../util/merge'
import { createPatchFromMutations } from '../util/set'
import { isFunction } from '../util/is'

export default function createStoreFactory(applyPatchFunction) {
    return function createStore(state) {
        const listeners = new Map()

        function getState() {
            return merge({}, api.state)
        }

        function subscribe(listener, filter) {
            return listeners.set(listener, filter)
        }

        function unsubscribe(listener) {
            return listeners.delete(listener)
        }

        function patch(patch) {
            const outputs = []
            let { mutations, result, unpatch } = applyPatchFunction(
                api.state,
                patch
            )
            outputs.mutations = mutations
            outputs.unpatch = unpatch
            api.state = result

            listeners.forEach((filter, listener) => {
                mutations = isFunction(filter)
                    ? mutations.filter(filter)
                    : mutations

                const { patch, unpatch } = createPatchFromMutations(mutations)
                outputs.push({
                    listener,
                    patch,
                    unpatch,
                    mutations
                })
            })

            return outputs
        }

        function patchAndEmit(p) {
            return patch(p).map(({ listener, patch }) => listener(patch))
        }

        const api = {
            state,
            listeners,
            getState,
            subscribe,
            unsubscribe,
            patch,
            patchAndEmit
        }

        return api
    }
}
