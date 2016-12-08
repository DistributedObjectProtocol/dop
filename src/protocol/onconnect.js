// client side
dop.protocol.onconnect = function(node, request_id, request) {
    var tokenServer=request[1],
        response = dop.core.createResponse(request_id, 0);
    node.tokenServer = tokenServer;
    node.emit(dop.CONS.CONNECT);
    node.send(JSON.stringify(response));
};