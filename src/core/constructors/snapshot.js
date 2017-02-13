
dop.core.snapshot = function(mutations) {
    this.done = true;
    this.mutations = mutations;
};


dop.core.snapshot.prototype.getAction = function() {
    if (this.action === undefined)
        this.action = dop.getAction(this.mutations);
    return this.action;
};


dop.core.snapshot.prototype.getUnaction = function() {
    if (this.unaction === undefined)
        this.unaction = dop.getUnaction(this.mutations);
    return this.unaction;
};


dop.core.snapshot.prototype.redo = function() {
    return this.redoWithoutEmit();
};


dop.core.snapshot.prototype.undo = function() {
    return this.undoWithoutEmit();
};


dop.core.snapshot.prototype.redoWithoutEmit = function() {
    return dop.setAction(this.getAction());
};


dop.core.snapshot.prototype.undoWithoutEmit = function() {
    return dop.setAction(this.getUnaction());
};