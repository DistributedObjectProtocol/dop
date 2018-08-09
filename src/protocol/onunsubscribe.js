dop.protocol.onunsubscribe = function(node, request_id, request) {
    var object_id = request[1],
        object_data = dop.data.object[object_id],
        response = dop.core.createResponse(request_id)

    if (
        isObject(object_data) &&
        isObject(object_data.node[node.token]) &&
        object_data.node[node.token].subscriber
    ) {
        var roles = object_data.node[node.token]
        roles.subscriber = 0

        if (roles.owner === 0) object_data.nodes_total -= 1

        if (object_data.nodes_total === 0) delete dop.data.object[object_id]

        response.push(0)
    } else response.push(dop.core.error.reject_remote.SUBSCRIPTION_NOT_FOUND)

    dop.core.storeSendMessages(node, response)
}
