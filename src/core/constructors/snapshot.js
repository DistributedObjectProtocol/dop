dop.core.snapshot = function Snapshot(mutations) {
    this.mutations = mutations
    this.forward = true
}

dop.core.snapshot.prototype.undo = function() {
    if (this.forward && this.mutations.length > 0) {
        this.forward = false
        this.setPatch(this.getUnpatch())
    }
}

dop.core.snapshot.prototype.redo = function() {
    if (!this.forward && this.mutations.length > 0) {
        this.forward = true
        this.setPatch(this.getPatch())
    }
}

dop.core.snapshot.prototype.emit = function(shallWeEmitToNode) {
    if (this.mutations.length > 0) {
        dop.core.emitToObservers(this, shallWeEmitToNode)
    }
}

dop.core.snapshot.prototype.getPatch = function() {
    return (this.patch =
        this.patch === undefined
            ? dop.core.getPatch(this.mutations)
            : this.patch)
}

dop.core.snapshot.prototype.getUnpatch = function() {
    return (this.unpatch =
        this.unpatch === undefined
            ? dop.core.getUnpatch(this.mutations)
            : this.unpatch)
}

dop.core.snapshot.prototype.setPatch = function(patch) {
    for (var object_id in patch)
        dop.core.setPatch(
            patch[object_id].object,
            patch[object_id].chunks,
            dop.core.setPatchMutator
        )
}
