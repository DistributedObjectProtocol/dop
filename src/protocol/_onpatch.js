dop.protocol._onpatch = function(node, request_id, request, response) {
    var rejection = response[0],
        object_id_owner = request[2],
        subscriber = node.subscriber[object_id_owner],
        version = request[3],
        pending_list = subscriber.pending,
        promise = request.promise,
        index = 0,
        total = pending_list.length,
        version_item

    if (rejection !== undefined) {
        if (rejection === 0) {
            for (; index < total; index++) {
                version_item = pending_list[index][0]
                // Removing from pending because its been received correctly
                if (version_item >= version) {
                    if (version_item === version) pending_list.splice(index, 1)
                    break
                }
                // Resending
                else
                    dop.protocol.patchSend(
                        node,
                        object_id_owner,
                        version_item,
                        pending_list[index][1]
                    )
            }
            promise.resolve(response[1])
        } else promise.reject(dop.core.getRejectError(rejection))
    }
}
