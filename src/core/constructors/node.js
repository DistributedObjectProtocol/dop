
dop.core.node = function() {
    // Inherit emitter
    dop.util.merge(this, new dop.util.emitter); //https://jsperf.com/inheritance-call-vs-object-assign
    this.connected = false;
    this.request_inc = 1;
    this.requests = {};
    this.requests_queue = [];
    this.object_subscribed = {};
    this.object_owner = {};
    // Generating token
    do { this.token = dop.util.uuid() }
    while (typeof dop.data.node[this.token]=='object');
};



dop.core.node.prototype.send = function(message) {
    this.emit(dop.cons.SEND, message);
};

dop.core.node.prototype.disconnect = function() {
    this.emit(dop.cons.DISCONNECT);
};

dop.core.node.prototype.subscribe = function() {
    return dop.protocol.subscribe(this, arguments);
};

