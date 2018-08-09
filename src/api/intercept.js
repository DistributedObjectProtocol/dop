dop.intercept = function(object, property, callback) {
    dop.util.invariant(
        dop.isRegistered(object),
        'dop.intercept() needs a registered object as first parameter'
    )
    var path = dop.getObjectPath(object)
    dop.util.invariant(
        isArray(path),
        'dop.intercept() The object you are passing is not allocated to a registered object'
    )
    var type = 'interceptors'
    if (arguments.length === 2) callback = property

    dop.util.invariant(
        isFunction(callback),
        'dop.intercept() needs a callback as last parameter'
    )

    var path_id = dop.core.getPathId(path),
        data_path = dop.data.path

    if (arguments.length === 3) {
        type = 'interceptors_prop'
        path_id += dop.core.pathSeparator(property)
    }

    if (data_path[path_id] === undefined) data_path[path_id] = {}

    if (data_path[path_id][type] === undefined) data_path[path_id][type] = []

    var interceptors = data_path[path_id][type]
    interceptors.push(callback)

    return function dispose() {
        // delete interceptors[interceptors.indexOf(callback)]; // we splice in dop.core.runInterceptors
        interceptors.splice(interceptors.indexOf(callback), 1)
    }
}
