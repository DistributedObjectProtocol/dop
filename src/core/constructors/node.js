dop.core.node = function Node(transport) {
    // Inherit emitter
    dop.util.merge(this, new dop.util.emitter()) //https://jsperf.com/inheritance-call-vs-object-assign
    this.transport = transport
    this.status = dop.cons.NODE_STATUS_DISCONNECTED
    this.request_inc = 1
    this.requests = {}
    this.request_queue = [] // [<request>, <wrapper>]
    this.subscriber = {}
    this.owner = {}
    // this.sends_queue = []
}

dop.core.node.prototype.send = function(message) {
    return this.sendSocket(message)
    // if (
    //     this.status !== dop.cons.NODE_STATUS_CONNECTED ||
    //     this.sends_queue.length > 0 ||
    //     this.sendSocket(message) === false
    // ) {
    //     this.sends_queue.push(message)
    //     return false
    // }
    // return true
}

dop.core.node.prototype.disconnect = function() {
    return this.disconnectSocket()
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
