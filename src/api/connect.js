

dop.connect = function( options ) {

    if ( dop.util.typeof(options) != 'object' )
        options = {};

    if ( typeof options.adapter != 'function' )
        options.adapter = dop.adapter.browser.connect.WebSocket;


    var node = new dop.core.node();

    node.options = options;

    node.adapter_name = options.adapter._name;

    node.socket = options.adapter(node, options);

    return node;

};
