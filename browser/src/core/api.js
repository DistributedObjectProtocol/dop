

synko.api = function( url, options ) {    


    if (synko.util.typeof(options) != 'object')
        options = {};

    if (typeof options.connector != 'function')
        options.connector = synko.ws;

    this.options.url = url;
    this.options.stringify_function = synko.stringify_function;
    this.options.stringify_undefined = synko.stringify_undefined;
    this.options.stringify_regexp = synko.stringify_regexp;




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

    this.synko = this; // Alias needed for shared methods server&client side. As api/request.js - user/request.js

    this.observe = synko.observe.bind(this);

    this.send = function ( data ) {
        this.connector.send( data );
    };

    this.close = function () {
        this.connector.close();
    };

    // Constructor emitter
    synko.util.emitter.call( this );

};

// Extending from EventEmitter
synko.api.prototype = Object.create(
    (typeof EventEmitter == 'function') ? 
        EventEmitter.prototype
    :
        synko.util.emitter.prototype
);
