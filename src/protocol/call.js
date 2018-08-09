dop.protocol.call = function(node, object_id, path, params) {
    var object_data = dop.data.object[object_id]

    if (
        isObject(object_data) &&
        isObject(object_data.node[node.token]) &&
        object_data.node[node.token].owner > 0
    ) {
        params = Array.prototype.slice.call(params, 0)
        var request = dop.core.createRequest(
            node,
            dop.protocol.instructions.call,
            object_data.node[node.token].owner,
            path,
            params
        )
        dop.core.storeSendMessages(node, request)
        return request.promise
    } else return Promise.reject(dop.core.error.reject_local.NODE_NOT_FOUND)
}
