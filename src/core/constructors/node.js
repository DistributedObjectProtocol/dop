
dop.core.node = function() {
    // Inherit emitter
    dop.util.emitter.call(this); //https://jsperf.com/inheritance-call-vs-object-assign
    this.object_owned = {};
    this.object_subscribed = {};
    this.request_inc = 1;
    this.requests = {};
    this.requests_queue = [];
    this.readyState = 0; //0:disconnect, 1:open, 2:connected
    // Generating token
    do { this.token = dop.util.uuid() }
    while (typeof dop.data.node[this.token]=='object');
};
// Inherit emitter
dop.util.merge(dop.core.node.prototype, dop.util.emitter.prototype);



dop.core.node.prototype.send = function(message) {
    this.socket.send(message);
};


dop.core.node.prototype.subscribe = function() {
    return dop.protocol.subscribe(this, arguments);
};


dop.core.node.prototype.close = function() {
    return this.socket.close();
};