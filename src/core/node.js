

dop.core.node = function( ) {

    // Constructor emitter
    dop.util.emitter.call( this );

    this.is_connected = false;

    this.request_id = 1;
    this.request = {};

    this.object_id = {};
    this.object_ref = {};
    this.object = {};

    // this.token = dop.core.generateToken();

};

// Extending from EventEmitter
dop.core.node.prototype = Object.create( dop.util.emitter.prototype );
