

syncio.api = function( options ) {

    this.options = (syncio.util.typeof(options) == 'object') ? options : {};
    this.options.stringify_params = {};

    if (typeof this.options.connector != 'function')
        this.options.connector = syncio.ws;

    if (typeof this.options.namespace != 'string')
        this.options.namespace = '/' + syncio.name;


    if (typeof this.options.stringify_function != 'string')
        this.options.stringify_function = syncio.stringify_function;
    else
        this.options.stringify_params[syncio.stringify_function] = this.options.stringify_function;

    if (typeof this.options.stringify_undefined != 'string')
        this.options.stringify_undefined = syncio.stringify_undefined;
    else
        this.options.stringify_params[syncio.stringify_undefined] = this.options.stringify_undefined;

    if (typeof this.options.stringify_regexp != 'string')
        this.options.stringify_regexp = syncio.stringify_regexp;
    else
        this.options.stringify_params[syncio.stringify_regexp] = this.options.stringify_regexp;




    var on = {

        open: syncio.on.open.bind( this ),

        message: syncio.on.message.bind( this ),

        close: syncio.on.close.bind( this )

    };


    this.objects = {};
    this.object_id = 0;

    this.users = {};
    this.user_inc = 0;

    this.requests = {};
    this.requests_inc = 1;
    
    this.connector = this[this.options.connector.name_connector] = this.options.connector( this.options, on );

    this.observe = syncio.observe.bind(this);

};


syncio.api.prototype = Object.create( require('events').EventEmitter.prototype );

