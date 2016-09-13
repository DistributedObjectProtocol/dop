
dop.protocol.connect = function( node ) {
    
    var token;
    do {
        token = dop.util.uuid();
    } while( dop.util.typeof( dop.data.node[token] )=='object' );

    dop.data.node[token] = node;
    node.token = token;
    node.socket[dop.specialprop.socket_token] = token;
    node.send(JSON.stringify(
        dop.core.createRequest(node, dop.protocol.actions.connect, token)
    ));

};