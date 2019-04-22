dop.core.node = function Node(transport) {
    // Inherit emitter
    dop.util.merge(this, new dop.util.emitter()) //https://jsperf.com/inheritance-call-vs-object-assign
    this.transport = transport
    this.status = dop.cons.NODE_STATE_OPEN
    this.request_inc = 1
    this.requests = {}
    this.message_queue = [] // Response / Request / instrunctions queue
    this.sends_queue = []
    this.subscriber = {}
    this.owner = {}
    // Generating token temp
    do {
        // this.token = String(global.tokeninc++)
        this.token = dop.util.uuid(dop.cons.TOKEN_LENGTH / 2)
    } while (typeof dop.data.node[this.token] == 'object')
}

dop.core.node.prototype.send = function(message) {
    if (this.status === dop.cons.NODE_STATE_CONNECTED) {
        this.sendSocket(message)
    } else {
        this.sends_queue.push(message)
    }
}

dop.core.node.prototype.disconnect = function() {
    this.transport.forceDisconnect(this)
}

dop.core.node.prototype.subscribe = function() {
    return dop.protocol.subscribe(this, arguments)
}

dop.core.node.prototype.unsubscribe = function(object) {
    dop.util.invariant(
        dop.isRegistered(object),
        'Node.unsubscribe needs a subscribed object'
    )
    return dop.protocol.unsubscribe(this, object)
}
