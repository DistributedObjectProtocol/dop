dop.util.merge = function(first, second) {
    var args = arguments
    if (args.length > 2) {
        // Remove the first 2 arguments of the arguments and add thoose arguments as merged at the begining
        Array.prototype.splice.call(
            args,
            0,
            2,
            dop.util.merge.call(this, first, second)
        )
        // Recursion
        return dop.util.merge.apply(this, args)
    } else {
        dop.util.path(second, this, first, dop.util.mergeMutator)
        if (isArray(second)) first.length = second.length
        return first
    }
}

dop.util.mergeMutator = function(destiny, prop, value, tof_value) {
    if (tof_value == 'object' || tof_value == 'array')
        !destiny.hasOwnProperty(prop)
            ? (destiny[prop] = tof_value == 'array' ? [] : {})
            : destiny[prop]
    else destiny[prop] = value
}
