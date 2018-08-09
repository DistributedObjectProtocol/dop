dop.protocol.unsubscribe = function(node, object) {
    var object_id = dop.getObjectId(object),
        object_data = dop.data.object[object_id]

    if (
        isObject(object_data) &&
        isObject(object_data.node[node.token]) &&
        object_data.node[node.token].owner > 0
    ) {
        var request = dop.core.createRequest(
            node,
            dop.protocol.instructions.unsubscribe,
            object_data.node[node.token].owner
        )
        dop.core.storeSendMessages(node, request)
        return request.promise
    } else return Promise.reject(dop.core.error.reject_remote[2])
}
