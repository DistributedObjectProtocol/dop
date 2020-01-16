import { createPatchFromMutations } from '../util/set'
import { isFunction } from '../util/is'

export default function createStoreFactory(applyPatchFunction) {
    return function createStore(state) {
        const listeners = new Map()

        function subscribe(listener, filter) {
            listeners.set(listener, filter)
            return () => unsubscribe(listener) // This has become a kind of standard
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
                    : mutations //.slice(0)

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
