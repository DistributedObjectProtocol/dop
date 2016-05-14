

dop.protocol.createRequest = function(node, type, params) {

    var request = Array.prototype.slice.call(arguments, 1);
    var request_id = node.request_id++;

    request.unshift( request_id );
    node.requests[request_id] = request.slice(1);

    return request;

};