dop.protocol._onsubscribe = function(node, request_id, request, response) {
    if (response[0] !== undefined) {
        if (response[0] !== 0)
            request.promise.reject(dop.core.getRejectError(response[0]))
        else {
            var object_owner_id = response[1],
                object_owner = response[2],
                object_path = isArray(object_owner) ? object_owner : [],
                object,
                collector

            // New object
            if (node.owner[object_owner_id] === undefined) {
                // If is new object and third parameter is an array we must reject
                if (object_owner === object_path)
                    request.promise.reject(
                        dop.core.error.reject_local.OBJECT_NOT_FOUND
                    )

                collector = dop.collect()
                if (dop.isRegistered(request.into))
                    object = dop.core.setPatch(
                        request.into,
                        object_owner,
                        dop.core.setPatchFunctionMutator
                    )
                else
                    object = dop.register(
                        request.into === undefined
                            ? object_owner
                            : dop.core.setPatch(
                                  request.into,
                                  object_owner,
                                  dop.core.setPatchMutator
                              )
                    )
                dop.core.registerOwner(node, object, object_owner_id)
                collector.emit()
            }
            // Already registered
            else object = dop.data.object[node.owner[object_owner_id]].object

            object = dop.util.get(object, object_path)

            if (!isObject(object))
                request.promise.reject(
                    dop.core.error.reject_local.OBJECT_NOT_FOUND
                )
            else request.promise.resolve(dop.getObjectProxy(object))
        }
    }
}
