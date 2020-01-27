dop.core.storeRequest = function(node, request, wrapper) {
    if (typeof wrapper != 'function') wrapper = dop.encode
    node.request_queue.push([request, wrapper])
}
