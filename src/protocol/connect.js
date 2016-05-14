
dop.protocol.connect = function ( node ) {
    var token = dop.core.generateToken();
    dop.node[token] = node;
    node.token = token;
    node.socket[dop.key_user_token] = token;
    node.socket.send( JSON.stringify(dop.protocol.createRequest(node, dop.protocol.keys.connect, token)) );
};