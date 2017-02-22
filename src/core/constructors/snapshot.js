
dop.core.snapshot = function(mutations) {
    this.forward = true;
    this.mutations = mutations;
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
    if (this.patch === undefined)
        this.patch = dop.core.getPatch(this.mutations);
    return this.patch;
};