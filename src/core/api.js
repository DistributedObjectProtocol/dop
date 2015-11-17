

syncio.api = function( options ) {

    if (typeof options == 'undefined')
        options = {};

    if (typeof options.connector != 'function')
        options.connector = syncio.ws;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + syncio.name;


    var on = {

        open: syncio.on.open.bind( this ),

        message: syncio.on.message.bind( this ),

        close: syncio.on.close.bind( this )

    };


    this.objects = {};
    this.object_id = 0;

    this.users = {};
    this.user_inc = 0;

    this.key_remote_function = syncio.key_remote_function;
    
    this.connector = this[options.connector.name_connector] = options.connector( options, on );

    this.observe = syncio.observe.bind(this);

};


syncio.api.prototype = Object.create( require('events').EventEmitter.prototype );

