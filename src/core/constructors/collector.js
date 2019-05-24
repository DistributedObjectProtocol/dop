dop.core.collector = function Collector(queue, index) {
    this.active = true
    this.mutations = []
    this.queue = queue
    queue.splice(index, 0, this)
}

dop.core.collector.prototype.add = function(mutation) {
    if (
        this.active &&
        (this.filter === undefined || this.filter(mutation) === true)
    ) {
        this.mutations.push(mutation)
        return true
    }
    return false
}

dop.core.collector.prototype.emit = function(shallWeEmitToNode) {
    this.destroy()
    return this.emitWithoutDestroy(shallWeEmitToNode)
}

dop.core.collector.prototype.emitWithoutDestroy = function(shallWeEmitToNode) {
    var snapshot = new dop.core.snapshot(this.mutations)
    snapshot.emit(shallWeEmitToNode)
    this.mutations = []
    return snapshot
}

dop.core.collector.prototype.pause = function() {
    this.active = false
}

dop.core.collector.prototype.resume = function() {
    this.active = true
}

dop.core.collector.prototype.destroy = function() {
    this.active = false
    this.queue.splice(this.queue.indexOf(this), 1)
}
