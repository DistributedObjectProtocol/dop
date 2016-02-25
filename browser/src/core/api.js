

dop.api = function( options ) {    


    if (dop.util.typeof(options) != 'object')
        options = {};

    if (typeof options.connector != 'function')
        options.connector = dop.ws;

    // Creating default url
    if (typeof options.url != 'string')
        options.url = window.location.href;

    // Gettin data from url
    var url_data = /(ps|ss)?:\/\/([^/]+)?(?:\/([^/]+))?/.exec(options.url);

    // Adding default prefix
    if (typeof url_data[3] == 'string')
        options.prefix = url_data[3];

    if (typeof options.prefix != 'string')
        options.prefix = dop.name;

    options.prefix += options.connector.name_connector;

    if (typeof url_data[3] == 'undefined') {
        if ( options.url[options.url.length-1] !== '/')
            options.url += '/';
        options.url += options.prefix;
    }
    else
        options.url += options.connector.name_connector;;

    // Storing host
    options.host = url_data[2];

    // Is SSL protocol?
    options.ssl = (typeof url_data[1] == 'string' && (url_data[1].toLowerCase() === 'ps' || url_data[1].toLowerCase() === 'ss'));




    this.options = options;
    this.options.stringify_function = dop.stringify_function;
    this.options.stringify_undefined = dop.stringify_undefined;
    this.options.stringify_regexp = dop.stringify_regexp;




    this.objects = {
        // object: 
        // name: 
        // writable: 
    };
    this.objects_name = {
        // object: 
        // promise: 
        // request: 
    };


    this.requests_inc = 1;
    this.requests = {
        // id:
        // data:
        // promise:
    };

    this.dop = this; // Alias needed for shared methods server&client side. As api/request.js - user/request.js

    this.observe = dop.observe.bind(this);

    this.send = function ( data ) {
        this.connector.send( data );
    };

    this.close = function () {
        this.connector.close();
    };

    // Constructor emitter
    dop.util.emitter.call( this );

};

// Extending from EventEmitter
dop.api.prototype = Object.create(
    (typeof EventEmitter == 'function') ? 
        EventEmitter.prototype
    :
        dop.util.emitter.prototype
);
