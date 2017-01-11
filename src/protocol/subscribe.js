
dop.protocol.subscribe = function(node, params) {
    params = Array.prototype.slice.call(params, 0);
    params.unshift(node, dop.protocol.instructions.subscribe);
    var request = dop.core.createRequest.apply(node, params);
    request.promise.into = function(object) {
        if (dop.isObjectRegistrable(object))
            request.into = (dop.isRegistered(object)) ? dop.getObjectProxy(object) : object;
        return request.promise;
    };
    dop.core.storeSendMessages(node, request);
    return request.promise;
};