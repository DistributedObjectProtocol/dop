

dop.listen = function ( options ) {

    this.options = (dop.util.typeof(options) == 'object') ? options : {};
    this.options.encode_params = {};

    if (typeof this.options.listener != 'function')
        this.options.listener = dop.listener.ws;

    if (typeof this.options.namespace != 'string')
        this.options.namespace = '/' + dop.name;

    // Adding connector name to the end of the prefix/namespace
    this.options.namespace += this.options.listener._name;


    // Adding encode properties
    if (typeof this.options.encode_function != 'string')
        this.options.encode_function = synko.encode_function;
    else
        this.options.encode_params[synko.encode_function] = this.options.encode_function;

    if (typeof this.options.encode_undefined != 'string')
        this.options.encode_undefined = synko.encode_undefined;
    else
        this.options.encode_params[synko.encode_undefined] = this.options.encode_undefined;

    if (typeof this.options.encode_regexp != 'string')
        this.options.encode_regexp = synko.encode_regexp;
    else
        this.options.encode_params[synko.encode_regexp] = this.options.encode_regexp;



    var on = {

        open: dop.on.open.bind( this ),

        message: dop.on.message.bind( this ),

        close: dop.on.close.bind( this )

    };


};

dop.listen.prototype = dop.util.emitter.prototype;