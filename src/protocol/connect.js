
dop.protocol.connect = function(node) {
    var token, request;
    do {
        token = dop.util.uuid();
    } while( dop.util.typeof( dop.data.node[token] )=='object' );

    dop.data.node[token] = node;
    node.token = token;
    node.socket[CONS.socket_token] = token;

    request = dop.core.createRequest(node, dop.protocol.instructions.connect, token);
    dop.core.storeRequest(node, request);
    dop.core.emitRequests(node, JSON.stringify);
};