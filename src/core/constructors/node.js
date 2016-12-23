
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

dop.core.node.prototype.unsubscribe = function(object) {
    return dop.protocol.unsubscribe(this, object);
};



dop.protocol.unsubscribe = function(node, object) {
    var object_id = dop.getObjectId(object),
        object_data = dop.data.object[object_id];

    if (isObject(object_data) && isObject(object_data.node[node.token]) && object_data.node[node.token].owner) {
        var request = dop.core.createRequest(node, dop.protocol.instructions.unsubscribe, object_id);
        dop.core.storeRequest(node, request);
        if (node.connected)
            dop.core.sendRequests(node);
        return request.promise;
    }
    else
        return Promise.reject(dop.core.error.reject.SUBSCRIPTION_NOT_FOUND);
};


dop.protocol.onunsubscribe = function(node, request_id, request) {
    var object_id = request[1],
        object_data = dop.data.object[object_id],
        response = dop.core.createResponse(request_id);

    if (isObject(object_data) && isObject(object_data.node[node.token]) && object_data.node[node.token].subscribed) {
        
        var roles = object_data.node[node.token];
        roles.subscribed = false;

        if (roles.owner === false)
            object_data.nodes_total -= 1;

        if (object_data.nodes_total === 0)
            delete dop.data.object[object_id];

        response.push(0);
    }
    else
        response.push(dop.core.error.reject.SUBSCRIPTION_NOT_FOUND);

    dop.core.sendResponse(node, response);
};