import merge from '../util/merge'
import { createPatchFromMutations } from '../util/set'
import { isFunction } from '../util/is'

export default function createStoreFactory(applyPatchFunction) {
    return function createStore(state) {
        const listeners = new Map()

        function subscribe(listener, filter) {
            listeners.set(listener, filter)
        }

        function unsubscribe(listener) {
            listeners.delete(listener)
        }

        function applyPatch(patch) {
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

        const api = {
            state,
            listeners,
            subscribe,
            unsubscribe,
            applyPatch
        }

        return api
    }
}
