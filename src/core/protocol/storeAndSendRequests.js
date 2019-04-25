dop.core.storeAndSendRequests = function(node, message, wrapper) {
    dop.core.storeRequest(node, message, wrapper)
    dop.core.sendRequests(node)
}
