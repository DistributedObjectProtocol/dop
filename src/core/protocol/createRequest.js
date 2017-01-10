
dop.core.createRequest = function(node, instruction) {
    var request_id = node.request_inc++,
        request = Array.prototype.slice.call(arguments, 1),
        nameinstruction = dop.protocol.instructions[instruction],
        secondsTimeout = dop.protocol.timeouts[nameinstruction];

    node.requests[request_id] = request;
    request.unshift(request_id);
    request.promise = dop.createAsync();

    // Timeout request
    setTimeout(function() {
        if (node.requests[request_id] !== undefined) {
            dop.protocol['on'+nameinstruction+'timeout'](node, request_id, request);
            delete node.requests[request_id];
        }
    }, secondsTimeout);

    return request;
};

dop.protocol.onpatchtimeout = function(node, request_id, request) {
    dop.protocol.patchSend(node, request[2], request[3], request[4]);
};