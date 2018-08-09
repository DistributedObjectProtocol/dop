dop.core.node = function Node() {
    // Inherit emitter
    dop.util.merge(this, new dop.util.emitter()) //https://jsperf.com/inheritance-call-vs-object-assign
    this.connected = false
    this.request_inc = 1
    this.requests = {}
    this.message_queue = [] // Response / Request / instrunctions queue
    this.subscriber = {}
    this.owner = {}
    // Generating token
    do {
        this.token = dop.util.uuid()
    } while (typeof dop.data.node[this.token] == 'object')
}

dop.core.node.prototype.send = function(message) {
    this.emit(dop.cons.SEND, message)
}

dop.core.node.prototype.disconnect = function() {
    this.emit(dop.cons.DISCONNECT)
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
