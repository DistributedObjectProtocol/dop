dop.protocol.onbroadcast = function(node, request_id, request) {
    dop.protocol.onfunction(
        node,
        request_id,
        request,
        node.owner[request[1]],
        function(permission) {
            return permission.owner === request[1]
        }
    )
}
