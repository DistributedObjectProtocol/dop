import { createPatchAndUnpatchFromMutations } from '../util/patches.js'
import { isFunction } from '../util/is.js'

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

        function applyPatch(patch_or_fn) {
            const applied = applyPatchFunction(api.state, patch_or_fn)

            const outputs = Array.from(listeners.entries()).map(
                ([listener, filter]) => {
                    const mutations = isFunction(filter)
                        ? applied.mutations.filter(filter)
                        : applied.mutations.slice(0)

                    const { patch, unpatch } =
                        createPatchAndUnpatchFromMutations(
                            mutations,
                            applied.patch
                        )

                    return {
                        listener,
                        patch,
                        unpatch,
                        mutations,
                    }
                }
            )

            outputs.mutations = applied.mutations
            outputs.patch = applied.patch
            outputs.unpatch = applied.unpatch

            return outputs
        }

        const api = {
            state,
            listeners,
            subscribe,
            unsubscribe,
            applyPatch,
        }

        return api
    }
}
