
dop.core.listener = function( options ) {

    if ( dop.util.typeof(options) != 'object' )
        options = {};

    if (typeof options.adapter != 'function')
        options.adapter = dop.adapter.nodejs.listen.WebSocket;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + dop.name;

    if (typeof options.try_connects != 'number' || options.try_connects<0)
        options.try_connects = 99;

    if ( dop.util.typeof(options.adapter) != 'array' )
        options.adapter = [options.adapter];


    this.options = options;
    
    // Adding adapters to start listening...
    this.adapter = {};
    for (var i=0,t=options.adapter.length; i<t; i++)
        this.adapter[options.adapter[i]._name] = options.adapter[i](this, options);

    // Inherit emitter
    dop.util.emitter.call( this );

};

// Extending from EventEmitter
dop.core.listener.prototype = Object.create( dop.util.emitter.prototype );
