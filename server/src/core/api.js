

synko.api = function( options ) {

    this.options = (synko.util.typeof(options) == 'object') ? options : {};
    this.options.stringify_params = {};

    if (typeof this.options.connector != 'function')
        this.options.connector = synko.ws;

    if (typeof this.options.namespace != 'string')
        this.options.namespace = '/' + synko.name;

    // Adding connector name to the end of the prefix/namespace
    this.options.namespace += this.options.connector.name_connector;


    if (typeof this.options.stringify_function != 'string')
        this.options.stringify_function = synko.stringify_function;
    else
        this.options.stringify_params[synko.stringify_function] = this.options.stringify_function;

    if (typeof this.options.stringify_undefined != 'string')
        this.options.stringify_undefined = synko.stringify_undefined;
    else
        this.options.stringify_params[synko.stringify_undefined] = this.options.stringify_undefined;

    if (typeof this.options.stringify_regexp != 'string')
        this.options.stringify_regexp = synko.stringify_regexp;
    else
        this.options.stringify_params[synko.stringify_regexp] = this.options.stringify_regexp;




    var on = {

        open: synko.on.open.bind( this ),

        message: synko.on.message.bind( this ),

        close: synko.on.close.bind( this )

    };


    this.objects = {};
    this.object_id = 0;

    this.users = {};
    this.user_inc = 0;

    this.requests = {};
    this.requests_inc = 1;
    
    this.connector = this[this.options.connector.name_connector] = this.options.connector( this.options, on );

    this.observe = synko.observe.bind(this);

};


synko.api.prototype = Object.create( require('events').EventEmitter.prototype );

