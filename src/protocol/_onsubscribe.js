dop.protocol._onsubscribe = function(node, request_id, request, response) {
    if (response[0] !== undefined) {
        if (response[0] !== 0)
            request.promise.reject(dop.core.getRejectError(response[0]))
        else {
            var object_owner_id = response[1]
            var object_owner = response[2]
            var object

            // Already subscribed
            if (node.owner[object_owner_id] !== undefined) {
                object = node.owner[object_owner_id].object
            }
            // New subscription
            else {
                var collector = dop.collect()
                // New object
                if (request.into === undefined) {
                    object = dop.register(object_owner)
                }
                // Registered object
                else if (dop.isRegistered(request.into)) {
                    object = dop.core.mergeSubscription(
                        request.into,
                        object_owner
                    )
                }
                // No registered object
                else {
                    object = dop.core.mergeSubscription(
                        dop.register(request.into),
                        object_owner
                    )
                }
                dop.core.configureRemoteFunctions(node, object, object_owner_id)
                dop.core.registerOwner(node, object, object_owner_id)
                collector.emit()
            }

            // Resolving/Rejecting promise
            if (!isObject(object)) {
                request.promise.reject(
                    dop.core.error.reject_local.OBJECT_NOT_FOUND
                )
            } else {
                request.promise.resolve(dop.getObjectProxy(object))
            }
        }
    }
}
