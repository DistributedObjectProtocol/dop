

dop.api = function( options ) {

    this.options = (dop.util.typeof(options) == 'object') ? options : {};
    this.options.stringify_params = {};

    if (typeof this.options.connector != 'function')
        this.options.connector = dop.ws;

    if (typeof this.options.namespace != 'string')
        this.options.namespace = '/' + dop.name;

    // Adding connector name to the end of the prefix/namespace
    this.options.namespace += this.options.connector.name_connector;


    if (typeof this.options.stringify_function != 'string')
        this.options.stringify_function = dop.stringify_function;
    else
        this.options.stringify_params[dop.stringify_function] = this.options.stringify_function;

    if (typeof this.options.stringify_undefined != 'string')
        this.options.stringify_undefined = dop.stringify_undefined;
    else
        this.options.stringify_params[dop.stringify_undefined] = this.options.stringify_undefined;

    if (typeof this.options.stringify_regexp != 'string')
        this.options.stringify_regexp = dop.stringify_regexp;
    else
        this.options.stringify_params[dop.stringify_regexp] = this.options.stringify_regexp;




    var on = {

        open: dop.on.open.bind( this ),

        message: dop.on.message.bind( this ),

        close: dop.on.close.bind( this )

    };


    this.objects = {};
    this.object_id = 0;

    this.users = {};
    this.user_inc = 0;

    this.requests = {};
    this.requests_inc = 1;
    
    this.connector = this[this.options.connector.name_connector] = this.options.connector( this.options, on );

    this.observe = dop.observe.bind(this);

};


dop.api.prototype = Object.create( require('events').EventEmitter.prototype );

