
dop.protocol.onconnect = function(node, request_id, request) {
    
    var token=request[1], response;

    if (dop.data.node[token] === undefined) {
        dop.core.registerNode(node, token);
        response = dop.core.createResponse(request_id, 0);
        node.readyState = 2;
        node.emit('connect', token);
    }
    else
        response = dop.core.createResponse(request_id, 1);

    node.send(JSON.stringify(response));

};
