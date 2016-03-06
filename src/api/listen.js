

dop.listen = function ( options ) {
    return new dop.listen.api( options );
};

dop.listen.api = function( options ) {

    if ( dop.util.typeof(options) != 'object' )
        options = {};

    if (typeof options.adapter != 'function')
        options.adapter = dop.listener.ws;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + dop.name;


    this.options = options;
    
    // Start listening...
    this.adapter = options.adapter.call(this, this.options);

    // Constructor emitter
    dop.util.emitter.call( this );

};

// Extending from EventEmitter
dop.listen.api.prototype = Object.create( dop.util.emitter.prototype );
