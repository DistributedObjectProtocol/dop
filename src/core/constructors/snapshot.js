
dop.core.snapshot = function(mutations) {
    this.done = true;
    this.mutations = mutations;
};


dop.core.snapshot.prototype.getPatch = function() {
    if (this.patch === undefined)
        this.patch = dop.core.getPatch(this.mutations);
    return this.patch;
};


dop.core.snapshot.prototype.getUnpatch = function() {
    if (this.unpatch === undefined)
        this.unpatch = dop.core.getUnpatch(this.mutations);
    return this.unpatch;
};


// dop.core.snapshot.prototype.redo = function() {
//     return this.redoWithoutEmit();
// };


// dop.core.snapshot.prototype.undo = function() {
//     return this.undoWithoutEmit();
// };


// dop.core.snapshot.prototype.redoWithoutEmit = function() {
//     return dop.core.setPatchs(this.getPatch());
// };


// dop.core.snapshot.prototype.undoWithoutEmit = function() {
//     return dop.core.setPatchs(this.getUnpatch());
// };