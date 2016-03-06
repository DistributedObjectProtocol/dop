

dop.connect = function( options ) {    

    if ( dop.util.typeof(options) != 'object' )
        options = {};

    if ( typeof options.adapter != 'function' )
        options.adapter = dop.connector.ws;


    var node = new dop.core.node();

    node.options = options;

    node.socket = options.adapter.call(node, node.options);

    return node;

};
