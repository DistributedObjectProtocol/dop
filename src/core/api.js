

syncio.api = function( options ) {

    if (syncio.util.typeof(options) != 'object')
        options = {};

    if (typeof options.connector != 'function')
        options.connector = syncio.ws;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + syncio.name;

    if (typeof options.stringify_function != 'string')
        options.stringify_function = syncio.stringify_function;

    if (typeof options.stringify_undefined != 'string')
        options.stringify_undefined = syncio.stringify_undefined;

    if (typeof options.stringify_regexp != 'string')
        options.stringify_regexp = syncio.stringify_regexp;


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

    this.stringify_function = options.stringify_function;
    this.stringify_undefined = options.stringify_undefined;
    this.stringify_regexp = options.stringify_regexp;
    
    this.connector = this[options.connector.name_connector] = options.connector( options, on );

    this.observe = syncio.observe.bind(this);

};


syncio.api.prototype = Object.create( require('events').EventEmitter.prototype );

