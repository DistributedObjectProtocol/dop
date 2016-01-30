

syncio.api = function() {    

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

    this.syncio = this; // Alias needed for shared methods server&client side. As api/request.js - user/request.js

    this.options = {
        stringify_function: syncio.stringify_function,
        stringify_undefined: syncio.stringify_undefined,
        stringify_regexp: syncio.stringify_regexp
    };

    this.observe = syncio.observe.bind(this);

    this.send = function ( data ) {
        this.connector.send( data );
    };

    this.close = function () {
        this.connector.close();
    };

    // Constructor emitter
    syncio.util.emitter.call( this );

};

// Extending from EventEmitter
syncio.api.prototype = Object.create(
    (typeof EventEmitter == 'function') ? 
        EventEmitter.prototype
    :
        syncio.util.emitter.prototype
);
