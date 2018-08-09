dop.core.createRequest = function(node) {
    var request_id = node.request_inc++,
        request = Array.prototype.slice.call(arguments, 1)

    node.requests[request_id] = request
    request.unshift(request_id)
    request.promise = dop.core.createAsync()

    return request
}
