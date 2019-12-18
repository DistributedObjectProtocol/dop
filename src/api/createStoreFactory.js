import merge from '../util/merge'
import { createPatchFromMutations } from '../util/set'

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

        function applyPatch(patch) {
            const returns = []
            const { mutations, result } = applyPatchFunction(api.state, patch)
            api.state = result
            listeners.forEach((filter, listener) => {
                // const mutations_filtered =
                //     isFunction(filter)
                //         ? mutations.filter(filter)
                //         : mutations

                // if (mutations_filtered.length > 0) {
                const { patch, unpatch } = createPatchFromMutations(mutations)
                returns.push({
                    listener,
                    patch,
                    unpatch,
                    mutations
                })
                // }
            })
            return returns
        }

        const api = {
            state,
            listeners,
            getState,
            subscribe,
            applyPatch,
            unsubscribe
        }

        return api
    }
}
