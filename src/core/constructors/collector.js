
dop.core.collector = function(queue, index) {
    this.active = true;
    this.shallWeGenerateAction = true;
    this.shallWeGenerateUnaction = true;
    this.mutations = [];
    this.queue = queue;
    queue.splice(index, 0, this);
};



dop.core.collector.prototype.add = function(mutation) {
    if (this.active && (this.filter===undefined || this.filter(mutation)===true)) {
        this.shallWeGenerateAction = true;
        this.shallWeGenerateUnaction = true;
        this.mutations.push(mutation);
        return true;
    }
    return false;
};


dop.core.collector.prototype.emit = function() {
    var mutations = this.mutations;
    dop.emit(mutations, this.action);
    this.mutations = [];
    return mutations;
};


dop.core.collector.prototype.emitAndPause = function() {
    this.pause();
    return this.emit();
};

dop.core.collector.prototype.pause = function() {
    this.active = false;
};

dop.core.collector.prototype.resume = function() {
    this.active = true;
};


dop.core.collector.prototype.destroy = function() {
    this.active = false;
    this.queue.splice(this.queue.indexOf(this), 1);
};


dop.core.collector.prototype.emitAndDestroy = function() {
    this.destroy();
    return this.emit();
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
