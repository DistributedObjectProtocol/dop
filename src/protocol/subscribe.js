
dop.protocol.subscribe = function(node, args) {
    args = Array.prototype.slice.call(args, 0);
    args.unshift(node, dop.protocol.instructions.subscribe);
    var request = dop.core.createRequest.apply(node, args);
    dop.core.storeRequest(node, request);
    if (node.connected)
        dop.core.sendRequests(node);
    return request.promise;
};