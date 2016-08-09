
dop.connect = function( options ) {

    if ( dop.util.typeof(options) != 'object' )
        options = {};

    if ( typeof options.transport != 'function' )
        options.transport = dop.transport.browser.connect.WebSocket;


    var node = new dop.core.node();

    node.options = options;

    node.transport_name = options.transport._name;

    node.socket = options.transport(node, options);

    return node;

};
