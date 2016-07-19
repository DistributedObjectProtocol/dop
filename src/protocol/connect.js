
dop.protocol.connect = function ( node ) {
    
    var token;
    do {
        token = ( dop.data.node_inc++ ).toString(36) + (Math.random() * 100000000000000000).toString(36); // http://jsperfcom/token-generator;
    } while( dop.util.typeof( dop.data.node[token] )=='object' );

    dop.data.node[token] = node;
    node.token = token;
    node.socket[dop.key_socket_token] = token;
    node.send(JSON.stringify(
        dop.core.createRequest(node, dop.protocol.actions.connect, token)
    ));

};