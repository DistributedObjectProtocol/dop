import { isPlainObject, isPlain } from '../util/is'
import { setDeep } from '../util/set'
import forEachObject from '../util/forEachObject'

export default function applyPatchFactory(patchers) {
    return function applyPatch(target, patch) {
        const mutations = []
        const target_root = { '': target } // a trick to allow top level patches
        const patch_root = { '': patch } // a trick to allow top level patches
        const unpatch_root = { '': {} }

        forEachObject(
            patch_root,
            target_root,
            ({ patch, target, prop, path }) => {
                const patch_value = patch[prop]
                const target_value = target[prop]
                const had_prop = target.hasOwnProperty(prop)
                if (
                    !had_prop ||
                    (patch_value !== target_value &&
                        !(
                            isPlainObject(patch_value) &&
                            isPlainObject(target_value)
                        ))
                ) {
                    target[prop] = patch_value

                    // Applying patches
                    const old_value = patchers.reduce(
                        (old_value, p) =>
                            p({
                                patch,
                                target,
                                prop,
                                path,
                                old_value,
                                had_prop,
                                applyPatch,
                            }),
                        target_value
                    )

                    // We register the mutation if old_value is different to the new value
                    if (target[prop] !== old_value) {
                        setDeep(unpatch_root, path.slice(0), old_value)
                        mutations.push({
                            old_value,
                            object: target,
                            prop,
                            path: path.slice(1),
                        })
                    }

                    return false // we don't go deeper
                }
            }
        )

        return {
            result: target_root[''],
            unpatch: unpatch_root[''],
            mutations,
        }
    }
}
