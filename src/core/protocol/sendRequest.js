dop.core.sendRequests = function(node) {
    var total = node.request_queue.length
    if (total > 0 && node.status === dop.cons.NODE_STATE_CONNECTED) {
        var index = 0
        var requests_wrapped = []
        var request_string
        var request
        var request_id

        for (; index < total; ++index) {
            request = node.request_queue[index][0]
            requests_wrapped.push(node.request_queue[index][1](request))
            request_id = request[0]
            // If is a request (not a response) we set a timeout
            if (request_id > 0) {
                var nameinstruction = dop.protocol.instructions[request[1]]
                request.timeout = setTimeout(function() {
                    // if (node.requests[request_id] !== undefined) {
                    dop.protocol['on' + nameinstruction + 'timeout'](
                        node,
                        request_id,
                        request
                    )
                    delete node.requests[request_id]
                    // }
                }, dop.protocol.timeouts[nameinstruction])
            }
        }

        // If we have more than 1 request we wrap it into one
        request_string =
            index > 1
                ? '[' + requests_wrapped.join(',') + ']'
                : requests_wrapped[0]

        node.request_queue = []
        node.send(request_string)
    }
}
