
dop.core.listener = function( options ) {

    if ( dop.util.typeof(options) != 'object' )
        options = {};

    if (typeof options.transport != 'function')
        options.transport = dop.transport.listen.WebSocket;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + dop.name;

    if (typeof options.try_connects != 'number' || options.try_connects<0)
        options.try_connects = 99;

    if ( dop.util.typeof(options.transport) != 'array' )
        options.transport = [options.transport];


    this.options = options;
    
    // Adding transports to start listening...
    this.transport = {};
    for (var i=0,t=options.transport.length; i<t; i++)
        this.transport[options.transport[i]._name] = options.transport[i](this, options);

    // Inherit emitter
    dop.util.emitter.call( this );

};

// Extending from EventEmitter
dop.core.listener.prototype = Object.create( dop.util.emitter.prototype );
