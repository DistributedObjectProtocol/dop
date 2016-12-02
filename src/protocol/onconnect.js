
dop.protocol.onconnect = function(node, request_id, request) {
    var tokenServer=request[1], response;
    // If not reconnecting, todoo
    dop.core.registerNode(node, tokenServer);
    response = dop.core.createResponse(request_id, 0);
    node.readyState = 2;
    node.emit('connect');
    node.send(JSON.stringify(response));
};

