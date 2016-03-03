

dop.connect = function( options ) {    
    return new dop.connect.api( options );
};

dop.connect.api = function( options ) {    

    // Constructor emitter
    dop.util.emitter.call( this );


    if ( dop.util.typeof(options) != 'object' )
        options = {};

    if ( typeof options.adapter != 'function' )
        options.adapter = dop.connector.ws;



    this.options = options;
    this.options.stringify_function = dop.stringify_function;
    this.options.stringify_undefined = dop.stringify_undefined;
    this.options.stringify_regexp = dop.stringify_regexp;


    this.adapter = options.adapter( this.options, {

        open: dop.on.open.bind(this),

        message: dop.on.message.bind(this),

        close: dop.on.close.bind(this),

        error: dop.on.error.bind(this)

    });

};

// Extending from EventEmitter
dop.connect.api.prototype = Object.create(
    (typeof EventEmitter == 'function') ? 
        EventEmitter.prototype
    :
        dop.util.emitter.prototype
);
