
dop.dispatch = function(mutations) {
    if ( this.mutations===mutations )
        dop.data.collectors.splice(dop.data.collectors.indexOf(this), 1);

    var action_unaction = dop.core.emitMutations(mutations);
    dop.core.emitActionSubscribers(action_unaction.action);
    return action_unaction;
};