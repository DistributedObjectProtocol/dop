
dop.core.node = function() {
    // Inherit emitter
    dop.util.emitter.call(this); //https://jsperf.com/inheritance-call-vs-object-assign
    this.object_owned = {};
    this.object_subscribed = {};
    this.request_inc = 1;
    this.requests = {};
    this.requests_queue = [];
    this.send_queue = [];
    this.readyState = 0; //0:close, 1:open, 2:connected
};
// Inherit emitter
dop.util.merge(dop.core.node.prototype, dop.util.emitter.prototype);



dop.core.node.prototype.send = function(message) {
    (this.readyState>0) ? this.socket.send(message) : this.send_queue.push(message);
};


dop.core.node.prototype.subscribe = function() {
    return dop.protocol.subscribe(this, arguments);
};


dop.core.node.prototype.close = function() {
    return this.socket.close();
};