

dop.listen = function ( options ) {

    return new dop.listen.api( options );

};

dop.listen.api = function( options ) {

    if ( dop.util.typeof(options) != 'object' )
        options = {};

    options.encode_params = {};

    if (typeof options.adapter != 'function')
        options.adapter = dop.listener.ws;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + dop.name;

    // // Adding adapter name to the end of the prefix/namespace
    // options.namespace += options.adapter._name;


    // Adding encode properties
    if (typeof options.encode_function != 'string')
        options.encode_function = dop.encode_function;
    else
        options.encode_params[dop.encode_function] = options.encode_function;

    if (typeof options.encode_undefined != 'string')
        options.encode_undefined = dop.encode_undefined;
    else
        options.encode_params[dop.encode_undefined] = options.encode_undefined;

    if (typeof options.encode_regexp != 'string')
        options.encode_regexp = dop.encode_regexp;
    else
        options.encode_params[dop.encode_regexp] = options.encode_regexp;


    this.options = options;
    this.nodes = [];
    
    // Start listening...
    this.adapter = options.adapter( this.options, {

        open: dop.on.open.bind( this ),

        message: dop.on.message.bind( this ),

        close: dop.on.close.bind( this )

    });


};

dop.listen.api.prototype = dop.util.emitter.prototype;