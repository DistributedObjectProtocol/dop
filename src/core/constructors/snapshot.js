
dop.core.snapshot = function (mutations) {
    this.mutations = mutations;
    this.forward = true;
};


dop.core.snapshot.prototype.undo = function () {
    if (this.forward && this.mutations.length>0) {
        this.forward = false;
        this.setPatch(this.getUnpatch());
        this.emit();
    }
};


dop.core.snapshot.prototype.redo = function () {
    if (!this.forward && this.mutations.length>0) {
        this.forward = true;
        this.setPatch(this.getPatch());
        this.emit();
    }
};


// This should be private
dop.core.snapshot.prototype.emit = function () {
    // This is true if we have nodes subscribed to those object/mutations
    // Then we have to emit to nodes
    if (this.mutations.length>0 && dop.core.emitObservers(this.mutations))
        dop.core.emitNodes(this.forward ? this.getPatch() : this.getUnpatch());
};


dop.core.snapshot.prototype.getPatch = function() {
    return this.patch = (this.patch === undefined) ?
        dop.core.getPatch(this.mutations)
    :
        this.patch;
};


dop.core.snapshot.prototype.getUnpatch = function() {
    return this.unpatch = (this.unpatch === undefined) ?
        dop.core.getUnpatch(this.mutations)
    :
        this.unpatch;     
};


dop.core.snapshot.prototype.setPatch = function(patch) {
    for (object_id in patch)
        dop.core.setPatch(patch[object_id].object, patch[object_id].chunks);
};