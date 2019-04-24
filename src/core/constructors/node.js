dop.core.node = function Node(transport) {
    // Inherit emitter
    dop.util.merge(this, new dop.util.emitter()) //https://jsperf.com/inheritance-call-vs-object-assign
    this.transport = transport
    this.status = dop.cons.NODE_STATE_OPEN
    this.request_inc = 1
    this.requests = {}
    this.message_queue = [] // Response / Request / instructions queue
    this.sends_queue = []
    this.subscriber = {}
    this.owner = {}
    this.token_local = dop.util.uuid(dop.cons.TOKEN_LENGTH / 2) // Pre token is used to combine with the remote pre token to generate the real token
    this.token_local = '_' + dop.env + (dop.inc = (dop.inc || 0) + 1) + '_'
}

dop.core.node.prototype.send = function(message) {
    if (
        this.status !== dop.cons.NODE_STATE_CONNECTED ||
        this.sends_queue.length > 0 ||
        !this.sendSocket(message)
    ) {
        this.sends_queue.push(message)
        return false
    }
    return true
}

dop.core.node.prototype.disconnect = function() {
    this.transport.onDisconnect(this)
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
