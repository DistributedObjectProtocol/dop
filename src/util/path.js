dop.util.path = function(source, callback, destiny, mutator) {
    var has_callback = isFunction(callback),
        has_destiny = isObject(destiny)
    dop.util.pathRecursive(
        source,
        callback,
        destiny,
        mutator,
        [],
        [],
        has_callback,
        has_destiny
    )
    return destiny
}

dop.util.pathRecursive = function(
    source,
    callback,
    destiny,
    mutator,
    circular,
    path,
    has_callback,
    has_destiny
) {
    var prop, value, tof_value, skip

    for (prop in source) {
        skip = false
        value = source[prop]
        path.push(prop)

        if (has_callback)
            skip = callback(source, prop, value, destiny, path, this)

        if (skip !== true) {
            tof_value = dop.util.typeof(value)

            if (has_destiny)
                skip = mutator(destiny, prop, value, tof_value, path)

            // Objects or arrays
            if (
                (tof_value == 'object' || tof_value == 'array') &&
                skip !== true &&
                value !== source &&
                circular.indexOf(value) == -1 &&
                (has_destiny && destiny[prop] !== undefined)
            ) {
                circular.push(value)
                dop.util.pathRecursive(
                    value,
                    callback,
                    has_destiny ? destiny[prop] : undefined,
                    mutator,
                    circular,
                    path,
                    has_callback,
                    has_destiny
                )
            }

            path.pop()
        }
    }
}
