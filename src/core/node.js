

dop.core.node = function( ) {

    // inherit emitter
    dop.util.emitter.call( this );

    this.is_connected = false;

    this.request_inc = 1;
    this.requests = {};

    this.object_ref = [];
    this.object = {};

};

// Extending from EventEmitter
dop.core.node.prototype = Object.create( dop.util.emitter.prototype );
