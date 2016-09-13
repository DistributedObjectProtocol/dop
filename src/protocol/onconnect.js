
dop.protocol.onconnect = function( node, request_id, request ) {
    
    var token=request[1], response;

    if ( dop.data.node[token] === undefined ) {
        dop.data.node[token] = node;
        node.status = 1;
        node.token = token;
        node.socket[dop.specialprop.socket_token] = token;
        response = dop.core.createResponse( request_id, 0 );
        node.emit('connect', token);
    }
    else
        response = dop.core.createResponse( request_id, 1 );

    node.send(JSON.stringify(response));

};