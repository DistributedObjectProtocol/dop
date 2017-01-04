
dop.protocol._oncall = function(node, request_id, request, response) {
    var rejection = response[0],
        promise = request.promise;
    if (rejection !== undefined) {
        if (rejection === 0)
            promise.resolve(response[1]);
        else if (rejection===dop.core.error.reject_remote.CUSTOM_REJECTION)
            promise.reject(response[1]);
        else
            promise.reject(dop.core.getRejectError(rejection));
    }
};