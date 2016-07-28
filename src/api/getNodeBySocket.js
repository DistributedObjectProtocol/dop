
dop.getNodeBySocket = function ( socket ) {
    var token_id = socket[dop.key_socket_token];
    return dop.data.node[ token_id ];
};