
dop.core.node = function( ) {
    // Inherit emitter
    Object.assign( this, dop.util.emitter.prototype );
    this.status = 0;
    this.request_inc = 1;
    this.requests = {};
    this.requests_agrouped = [];
    this.object_owned = {};
    this.object_subscribed = {};
    // this.object = {};
};