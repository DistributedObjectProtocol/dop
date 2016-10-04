
dop.core.node = function( ) {
    // Inherit emitter
    Object.assign( this, dop.util.emitter.prototype );
    this.status = 0;
    this.object_owned = {};
    this.object_subscribed = {};
    this.request_inc = 1;
    this.requests = {};
    this.requests_queue = [];
    this.sends_queue = [];
};



dop.core.node.prototype.send = function( message ) {
    return this.socket.send( message );
};



dop.core.node.prototype.subscribe = function( name ) {
    var args = Array.prototype.slice.call(arguments, 0), request;
    args.unshift( this, dop.protocol.instructions.subscribe );
    request = dop.core.createRequest.apply(this, args);
    this.send( dop.encode(request) );
    return request.promise;
};



dop.core.node.prototype.close = function() {
    return this.socket.close();
};