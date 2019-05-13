dop.core.mergeSubscription = function(object, object_remote) {
    return dop.util.path(
        object_remote,
        null,
        object,
        dop.core.mergeSubscriptionMutator
    )
}

dop.core.mergeSubscriptionMutator = function(
    destiny,
    prop,
    value,
    tof_value,
    path
) {
    if (isFunction(value) && value._name == dop.cons.REMOTE_FUNCTION_UNSETUP)
        dop.set(destiny, prop, value(dop.getObjectId(destiny), path.slice(0)))
    else if (tof_value == 'object' || tof_value == 'array')
        !destiny.hasOwnProperty(prop)
            ? (destiny[prop] = tof_value == 'array' ? [] : {})
            : destiny[prop]
    else destiny[prop] = value
}
