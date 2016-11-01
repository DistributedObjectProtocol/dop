
dop.core.collector = function(queue, index) {
    this.active = true;
    this.shallWeGenerateAction = true;
    this.shallWeGenerateUnaction = true;
    this.mutations = [];
    this.queue = queue;
    this.index = index;
    queue.splice(index, 0, this);
};



dop.core.collector.prototype.add = function(mutation) {
    if (this.active && (this.filter===undefined || this.filter(mutation) === true)) {
        this.shallWeGenerateAction = true;
        this.shallWeGenerateUnaction = true;
        this.mutations.push(mutation);
        return true;
    }
    return false;
};


dop.core.collector.prototype.emit = function() {
    this.active = false;
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


dop.core.collector.prototype.destroy = function() {
    this.queue.splice(index, 1);
};