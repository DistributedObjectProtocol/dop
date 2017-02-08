
dop.core.snapshot = function(mutations) {
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


dop.core.snapshot.prototype.setAction = function() {
    // for (var index=0,total=this.mutations.length, mutation; index<total; ++index) {
    //     mutation = this.mutations[index];
    //     console.log('mutation')
    // }
    dop.setAction(this.getAction())
};


dop.core.snapshot.prototype.setUnaction = function() {
    // for (var index=0,total=this.mutations.length; index<total; ++index) {
    //     console.log(this.mutations[index])
    // }
    dop.setUnaction(this.getUnaction())
};