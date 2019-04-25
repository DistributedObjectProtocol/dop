dop.protocol.broadcast = function(object_id, path, params) {
    var object_data = dop.data.object[object_id],
        promises = []

    if (isObject(object_data) && isObject(object_data.node)) {
        var token,
            node,
            request,
            nodes = object_data.node
        params = Array.prototype.slice.call(params, 0)
        for (token in nodes) {
            if (nodes[token].subscriber === 1) {
                node = dop.data.node[token]
                request = dop.core.createRequest(
                    node,
                    dop.protocol.instructions.broadcast,
                    object_id,
                    path,
                    params
                )
                request.promise.node = node
                dop.core.storeAndSendRequests(node, request)
                promises.push(request.promise)
            }
        }
    }

    return promises
}
