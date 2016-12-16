// client side
dop.protocol.onconnect = function(node, request_id, request) {
    var tokenServer = request[1],
        response = dop.core.createResponse(request_id, 0);
    node.tokenServer = tokenServer;
    dop.core.sendResponse(node, response, JSON.stringify);
    node.emit(dop.cons.CONNECT);
    dop.core.sendRequests(node);
};

