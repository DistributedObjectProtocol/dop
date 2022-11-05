import { isPlainObject, isPlain, isFunction } from '../util/is'
import { setDeep } from '../util/getset'
import { mergeCore } from '../util/merge'
import { producePatch } from '../util/patches'

export default function applyPatchFactory(patchers) {
    // return function applyPatch(target, patch_or_fn) {
    //     const patch = isFunction(patch_or_fn)
    //         ? producePatch(target, patch_or_fn).patch
    //         : patch_or_fn
    //     return applyPatchRaw(target, patch)
    // }

    return function applyPatch(target, patch) {
        const mutations = []
        const target_root = { '': target } // a trick to allow top level patches
        const patch_root = { '': patch } // a trick to allow top level patches
        const unpatch_root = { '': {} }

        function addMutation(target, prop, old_value, path) {
            mutations.push({
                target,
                prop,
                old_value,
                path,
            })
        }

        mergeCore(patch_root, target_root, ({ patch, target, prop, path }) => {
            const patch_value = patch[prop]
            const target_value = target[prop]
            if (
                !target.hasOwnProperty(prop) ||
                (patch_value !== target_value &&
                    !(isPlainObject(patch_value) && isPlain(target_value)))
            ) {
                const length = target.length

                // Applying patches
                const old_value = patchers.reduce(
                    (old_value, patcher) =>
                        patcher({
                            patch,
                            target,
                            prop,
                            old_value,
                            applyPatch,
                        }),
                    target_value
                )

                // We register the mutation if old_value is different to the new value
                if (target[prop] !== old_value) {
                    addMutation(target, prop, old_value, path.slice(1))
                    if (target.length !== length) {
                        addMutation(
                            target,
                            'length',
                            length,
                            path.slice(1, path.length - 1).concat('length')
                        )
                    }
                }

                return false // we don't go deeper
            }
        })

        // Creating unpatch
        for (let index = mutations.length - 1; index >= 0; --index) {
            const { path, old_value } = mutations[index]
            setDeep(unpatch_root, [''].concat(path), old_value)
        }

        return {
            result: target_root[''],
            patch,
            unpatch: unpatch_root[''],
            mutations,
        }
    }
}
