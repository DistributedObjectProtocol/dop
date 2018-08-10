dop.removeComputed = function(object, property, callback) {
    dop.util.invariant(
        dop.isRegistered(object),
        'dop.removeComputed needs a registered object as first parameter'
    )
    dop.util.invariant(
        property !== undefined,
        'dop.removeComputed needs a string or number as second parameter'
    )

    var computed_pathid = dop.core.getPathId(
            dop.getObjectPath(object, false).concat(property)
        ),
        shall_we_remove_all = !isFunction(callback),
        is_same_function,
        data_path = dop.data.path,
        removed = [],
        computed_ids,
        computed_id,
        computed,
        derivation_pathid,
        derivations,
        index,
        // total,
        index2,
        total2

    if (
        isObject(data_path[computed_pathid]) &&
        isArray(data_path[computed_pathid].computeds) &&
        data_path[computed_pathid].computeds.length > 0
    ) {
        computed_ids = data_path[computed_pathid].computeds
        for (index = 0; index < computed_ids.length; ++index) {
            computed_id = computed_ids[index]
            computed = dop.data.computed[computed_id]
            is_same_function = computed.function === callback
            if (shall_we_remove_all || is_same_function) {
                // Deleting computing itself
                delete dop.data.computed[computed_id]
                // Removing id in computed
                computed_ids.splice(computed_ids.indexOf(computed_id), 1)
                // Removing derivations
                for (
                    index2 = 0, total2 = computed.derivations.length;
                    index2 < total2;
                    ++index2
                ) {
                    derivation_pathid = computed.derivations[index2]
                    derivations = data_path[derivation_pathid].derivations
                    derivations.splice(derivations.indexOf(computed_id), 1)
                }
                index -= 1
                removed.push(computed.function)
            }

            if (is_same_function) break
        }
    }

    return removed
}
