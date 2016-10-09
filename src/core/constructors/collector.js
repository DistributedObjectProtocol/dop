
dop.core.collector = function() {
    this.shallWeGenerateAction = true;
    this.shallWeGenerateUnaction = true;
    this.mutations = [];
};



dop.core.collector.prototype.add = function(mutation) {
    if (this.filter===undefined || this.filter(mutation) === true) {
        this.shallWeGenerateAction = true;
        this.shallWeGenerateUnaction = true;
        this.mutations.push(mutation);
        return true;
    }
    return false;
};


dop.core.collector.prototype.emit = function() {
    dop.data.collectors.splice(dop.data.collectors.indexOf(this), 1);
    dop.emit(this.mutations, this.action);
};


dop.core.collector.prototype.getAction = function() {
    if (this.shallWeGenerateAction) {
        this.shallWeGenerateAction = false;
        this.action = dop.getAction(this.mutations);
    }
    return this.action;
};


dop.core.collector.prototype.getUnaction = function() {
    if (this.shallWeGenerateUnaction) {
        this.shallWeGenerateUnaction = false;
        this.unaction = dop.getUnaction(this.mutations);
    }
    return this.unaction;
};