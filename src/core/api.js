

syncio.api = function( options ) {

    if (typeof options == 'undefined')
        options = {};

    if (typeof options.connector != 'function')
        options.connector = syncio.ws;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + syncio.name;


    var on = {

        open: syncio.onopen.bind( this ),

        message: syncio.onmessage.bind( this ),

        close: syncio.onclose.bind( this )

    };


    this.objects_original = {};

    this.objects = {};
    this.object_id = 1;

    this.users = {};
    this.user_id = 1;

    this.requests = {};
    this.request_id = 1;

    this.remote_function = syncio.remote_function;
    
    this.connector = this[options.connector.name_connector] = options.connector( options, on );

    this.observe = syncio.observe.bind(this);

};


syncio.api.prototype = Object.create( require('events').EventEmitter.prototype );

