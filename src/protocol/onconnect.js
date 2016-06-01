

dop.protocol.onconnect = function ( node, request_id, request ) {
    
    var token=request[1], response;

    if ( typeof dop.node[token] == 'undefined' ) {
        dop.node[token] = node;
        node.is_connected = true;
        node.token = token;
        node.socket[dop.key_socket_token] = token;
        response = dop.protocol.createResponse( request_id, 0 );
        node.emit('connect', token);
    }
    else
        response = dop.protocol.createResponse( request_id, 1 );

    node.socket.send(JSON.stringify(response));

};