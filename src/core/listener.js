

dop.core.listener = function( options ) {

    if ( dop.util.typeof(options) != 'object' )
        options = {};

    if (typeof options.adapter != 'function')
        options.adapter = dop.adapter.nodejs.listen.WebSocket;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + dop.name;

    if (typeof options.try_connects != 'number' || options.try_connects<0)
        options.try_connects = 99;


    this.options = options;
    
    // Start listening...
    this.adapter = options.adapter(this, options);

    // Constructor emitter
    dop.util.emitter.call( this );

};

// Extending from EventEmitter
dop.core.listener.prototype = Object.create( dop.util.emitter.prototype );
