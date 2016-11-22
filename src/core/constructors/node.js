
dop.core.node = function() {
    // Inherit emitter
    dop.util.emitter.call(this); //https://jsperf.com/inheritance-call-vs-object-assign
    this.object_owned = {};
    this.object_subscribed = {};
    this.request_inc = 1;
    this.requests = {};
    this.requests_queue = [];
};
// Inherit emitter
Object.assign(dop.core.node.prototype, dop.util.emitter.prototype);



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
    args = Array.prototype.slice.call(args, 0);
    args.unshift(node, dop.protocol.instructions.subscribe);
    var request = dop.core.createRequest.apply(node, args);
    dop.core.storeRequest(node, request);
    dop.core.emitRequests(node);
    return request.promise;
};