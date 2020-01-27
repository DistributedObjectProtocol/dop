dop.core.mergeSubscription = function(object, object_remote) {
    return dop.util.path(
        object_remote,
        null,
        object,
        dop.util.mergeMutator
        // dop.core.mergeSubscriptionMutator
    )
}

// dop.core.mergeSubscriptionMutator = function(destiny, prop, value, tof_value) {
//     if (tof_value == 'object' || tof_value == 'array')
//         !destiny.hasOwnProperty(prop)
//             ? (destiny[prop] = tof_value == 'array' ? [] : {})
//             : destiny[prop]
//     else destiny[prop] = value
// }
