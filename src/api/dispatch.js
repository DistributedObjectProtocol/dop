
dop.dispatch = function(mutations) {
    if (mutations.length>0) {
        if ( this.mutations===mutations )
            dop.data.collectors.splice(dop.data.collectors.indexOf(this), 1);

        var action = dop.core.emitMutations(mutations);
        dop.core.emitActionSubscribers( action );
        return action;
    }
};