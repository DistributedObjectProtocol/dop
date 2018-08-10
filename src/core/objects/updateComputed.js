dop.core.updateComputed = function(computed_id, computed, context, old_value) {
    var data_path = dop.data.path,
        derived_paths,
        derived_pathsids = computed.derivations,
        derived_path,
        derived_pathid,
        value,
        index = 0,
        total,
        index2,
        total2

    // Running function and saving paths from getters
    dop.data.gets_collecting = true
    value = computed.function.call(context, old_value)
    dop.data.gets_collecting = false
    derived_paths = dop.data.gets_paths
    dop.data.gets_paths = []

    // Generating and storing paths ids
    for (total = derived_paths.length; index < total; ++index) {
        derived_path = derived_paths[index]
        derived_pathid = ''
        for (
            index2 = 0, total2 = derived_path.length;
            index2 < total2;
            ++index2
        ) {
            derived_pathid += dop.core.pathSeparator(derived_path[index2])
            if (index2 > 0) {
                if (data_path[derived_pathid] === undefined)
                    data_path[derived_pathid] = {}

                if (data_path[derived_pathid].derivations === undefined)
                    data_path[derived_pathid].derivations = []

                if (
                    data_path[derived_pathid].derivations.indexOf(computed_id) <
                    0
                ) {
                    data_path[derived_pathid].derivations.push(computed_id)
                    derived_pathsids.push(derived_pathid)
                }
            }
        }
    }

    // Storing computed in dop.data
    if (data_path[computed.pathid].computeds.indexOf(computed_id) === -1)
        data_path[computed.pathid].computeds.push(computed_id)

    return value
}
