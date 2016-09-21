
dop.core.createRequest = function( node, action ) {

    var request_id = node.request_inc++,
        request = Array.prototype.slice.call(arguments, 1);

    request.unshift( request_id );
    request.promise = dop.core.createAsync();
    node.requests[request_id] = request;

    return request;

};