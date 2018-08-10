dop.core.createComputed = function(object, prop, f, shall_we_set, old_value) {
    var data_path = dop.data.path,
        value,
        computed_id = dop.data.computed_inc++,
        computed = {
            object_root: dop.getObjectRoot(object),
            prop: prop,
            function: f,
            derivations: []
        },
        path = dop.getObjectPath(object, false)

    computed.path = path.slice(1)
    computed.pathid = dop.core.getPathId(path.concat(prop))

    if (data_path[computed.pathid] === undefined)
        data_path[computed.pathid] = {}

    if (data_path[computed.pathid].computeds === undefined)
        data_path[computed.pathid].computeds = []

    dop.data.computed[computed_id] = computed
    value = dop.core.updateComputed(computed_id, computed, object, old_value)

    // Setting value
    if (shall_we_set) dop.core.set(object, prop, value)

    return value
}
