

dop.protocol.onsync = function ( node, request_id, request ) {

    console.log(request)

    var name = request[1];

    console.log(dop.object_name[name]);
    
    // var token=request[1], response;

    // if ( typeof dop.node[token] == 'undefined' ) {
    //     dop.node[token] = node;
    //     node.is_connected = true;
    //     node.token = token;
    //     node.socket[dop.key_socket_token] = token;
    //     response = dop.core.createResponse( request_id, 0 );
    //     node.emit('connect', token);
    // }
    // else
    //     response = dop.core.createResponse( request_id, 1 );

    // node.send(JSON.stringify(response));

};