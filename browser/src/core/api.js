

synko.api = function() {    

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

    this.options = {
        stringify_function: synko.stringify_function,
        stringify_undefined: synko.stringify_undefined,
        stringify_regexp: synko.stringify_regexp
    };

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
