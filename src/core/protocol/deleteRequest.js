dop.core.deleteRequest = function(node, request_id) {
    clearTimeout(node.requests[request_id].timeout)
    delete node.requests[request_id]
}
