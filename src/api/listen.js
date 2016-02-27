

dop.listen = function ( options ) {

    return new dop.listen.api( options );

};

dop.listen.api = function( options ) {

    this.options = (dop.util.typeof(options) == 'object') ? options : {};
    this.options.encode_params = {};

    if (typeof this.options.listener != 'function')
        this.options.listener = dop.listener.ws;

    if (typeof this.options.namespace != 'string')
        this.options.namespace = '/' + dop.name;

    // Adding listener name to the end of the prefix/namespace
    this.options.namespace += this.options.listener._name;


    // Adding encode properties
    if (typeof this.options.encode_function != 'string')
        this.options.encode_function = dop.encode_function;
    else
        this.options.encode_params[dop.encode_function] = this.options.encode_function;

    if (typeof this.options.encode_undefined != 'string')
        this.options.encode_undefined = dop.encode_undefined;
    else
        this.options.encode_params[dop.encode_undefined] = this.options.encode_undefined;

    if (typeof this.options.encode_regexp != 'string')
        this.options.encode_regexp = dop.encode_regexp;
    else
        this.options.encode_params[dop.encode_regexp] = this.options.encode_regexp;



    this.nodes = [];
    
    // Start listening...
    this.listener = this[this.options.listener._connector] = this.options.listener( this.options, {

        open: dop.on.open.bind( this ),

        message: dop.on.message.bind( this ),

        close: dop.on.close.bind( this )

    });

};

dop.listen.api.prototype = dop.util.emitter.prototype;