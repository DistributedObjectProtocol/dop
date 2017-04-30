
dop.core.snapshot = function (mutations) {
    this.forward = true;
    this.mutations = mutations;
    // this.patchRedo;
    // this.patchUndo;
};


// dop.core.snapshot.prototype.undo = function () {
//     if (this.forward && this.mutations.length>0) {
//         this.forward = false;
//         dop.core.invertMutations(this.mutations);
//         this.emit();
//     }
// };


// dop.core.snapshot.prototype.redo = function () {
//     if (!this.forward && this.mutations.length>0) {
//         this.forward = true;
//         dop.core.invertMutations(this.mutations);
//         this.emit();
//     }
// };



dop.core.snapshot.prototype.emit = function () {
    // This is true if we have nodes subscribed to those object/mutations
    // Then we have to emit to nodes
    if (this.mutations.length>0 && dop.core.emitObservers(this.mutations)) {
        dop.core.emitNodes(this.forward ?
            (this.redoPatch === undefined) ?
                this.redoPatch = dop.core.getPatch(this.mutations) : this.redoPatch
            :
            (this.undoPatch === undefined) ?
                this.undoPatch = dop.core.getPatch(this.mutations) : this.undoPatch
        );
    }
};