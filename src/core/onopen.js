
dop.core.onopen = function( listener_or_node, socket, adapter_name ){

    listener_or_node.emit( 'open', socket );

    // if side is listener we send token
    if ( listener_or_node.socket !== socket ) {
        var node = new dop.core.node();
        node.adapter_name = adapter_name;
        node.socket = socket;
        node.socket[dop.key_socket_maxrejects] = 0;
        node.try_connects = listener_or_node.options.try_connects;
        node.listener = listener_or_node;
        dop.protocol.connect( node );
    }

};


