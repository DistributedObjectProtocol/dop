
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



dop.core.node.prototype.send = function(message) {
    return this.socket.send(message);
};



dop.core.node.prototype.subscribe = function() {
    return dop.protocol.subscribe(node, arguments);
};



dop.core.node.prototype.close = function() {
    return this.socket.close();
};


dop.protocol.subscribe = function(node, args) {
    args = Array.prototype.slice.call(args,0);
    args.unshift( node, dop.protocol.instructions.subscribe );
    var request = dop.core.createRequest.apply(node, args);
    dop.core.storeRequest(node, request);
    dop.core.emitRequests(node);
    return request.promise;
};