
dop.core.node = function( ) {

    // Inherit emitter
    dop.util.emitter.call( this );

    this.status = 0;

    this.request_inc = 1;
    this.requests = {};

    this.object_ref = {};
    this.object_name = {};
    this.object = {};

};

// Extending from EventEmitter
dop.core.node.prototype = Object.create( dop.util.emitter.prototype );
