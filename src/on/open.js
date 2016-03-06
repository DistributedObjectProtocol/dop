

dop.on.open = function( listener, socket ){

    var node = new dop.core.node();
    node.socket = socket;
    node.listener = listener;

    // Generating token
    var token;
    do {
        token = dop.core.generateToken();
    } while ( dop.node[ token ] !== undefined );

    // Saving token
    dop.node[token] = node;
    node.token = token;
    socket[dop.key_user_token] = token;

    // Events
    listener.emit( 'open', node );
    node.emit( 'open' );

};