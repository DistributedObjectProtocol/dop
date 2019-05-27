dop.protocol.call = function(node, object_owner_id, path, params) {
    var owner = node.owner[object_owner_id]
    if (isObject(owner)) {
        params = Array.prototype.slice.call(params, 0)
        var request = dop.core.createRequest(
            node,
            dop.protocol.instructions.call,
            object_owner_id,
            path,
            params
        )
        dop.core.storeAndSendRequests(node, request)
        return request.promise
    } else return Promise.reject(dop.core.error.reject_local.NODE_NOT_FOUND)
}
