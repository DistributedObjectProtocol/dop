dop.core.storeAndSendRequests = function(node, request, wrapper) {
    dop.core.storeRequest(node, request, wrapper)
    dop.core.sendRequests(node)
}
