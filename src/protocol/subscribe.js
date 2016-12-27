
dop.protocol.subscribe = function(node, args) {
    args = Array.prototype.slice.call(args, 0);
    args.unshift(node, dop.protocol.instructions.subscribe);
    var request = dop.core.createRequest.apply(node, args);
    request.promise.into = function(object) {
        if (dop.isObjectRegistrable(object))
            request.into = object;
        return request.promise;
    };
    dop.core.storeSendMessages(node, request);
    return request.promise;
};