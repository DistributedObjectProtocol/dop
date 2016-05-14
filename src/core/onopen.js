

dop.core.onopen = function( listener_or_node, socket ){

    listener_or_node.emit( 'open', socket );

    // if env is listener we send token
    if ( listener_or_node.socket !== socket ) {
        var node = new dop.core.node();
        node.socket = socket;
        node.listener = listener_or_node;
        dop.protocol.connect( node );
    }

};
