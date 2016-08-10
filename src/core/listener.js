
dop.core.listener = function( options ) {

    // Inherit emitter
    dop.util.emitter.call( this );

    this.options = options;
    // Adding/running transport to start listening...
    this.transport = options.transport(this, options, dop);

};

// Extending from EventEmitter
dop.core.listener.prototype = Object.create( dop.util.emitter.prototype );
