
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
        this.emit();
    }
};


dop.core.snapshot.prototype.redo  = function() {
    if (!this.forward) {
        this.forward = true;
        dop.core.invertMutations(this.mutations);
        this.emit();
    }
};



dop.core.snapshot.prototype.emit = function() {
    // This is true if we have nodes subscribed to those object/mutations
    if (dop.core.emitObservers(this.mutations)) {
        var path;
        if (this.forward) {
            if (this.redoPatch === undefined)
                this.redoPatch = dop.core.getPatch(this.mutations);
            path = this.redoPatch;
        }
        else {
            if (this.undoPatch === undefined)
                this.undoPatch = dop.core.getPatch(this.mutations);
            path = this.undoPatch;
        }
        dop.core.emitNodes(path);
    }
};

