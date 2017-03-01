
dop.core.snapshot = function(mutations) {
    this.forward = true;
    this.mutations = mutations;
    // this.patchRedo;
    // this.patchUndo;
};


dop.core.snapshot.prototype.undo = function() {
    if (this.forward) {
        this.forward = false;
        dop.core.invertMutations(this.mutations);
    }
};


dop.core.snapshot.prototype.redo  = function() {
    if (!this.forward) {
        this.forward = true;
        dop.core.invertMutations(this.mutations);
    }
};


dop.core.snapshot.prototype.getPatch = function() {
    if (this.forward) {
        if (this.redoPatch === undefined)
            this.redoPatch = dop.core.getPatch(this.mutations);
        return this.redoPatch;
    }
    else {
        if (this.undoPatch === undefined)
            this.undoPatch = dop.core.getPatch(this.mutations);
        return this.undoPatch;
    }
};