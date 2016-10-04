
dop.dispatch = function(mutations) {
    var action;
    if (this.mutations===mutations ) {
        action = this.action;
        dop.data.collectors.splice(dop.data.collectors.indexOf(this), 1);
    }

    if (mutations.length>0) {
        dop.core.emitMutations(mutations);
        if (action === undefined)
            action = dop.getAction(mutations);
        dop.core.emitActionSubscribers(action);
        return action;
    }
};