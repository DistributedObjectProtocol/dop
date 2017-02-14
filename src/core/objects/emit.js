
dop.core.emit = function(snapshot) {
    // This is true if we have nodes subscribed to those object/mutations
    if (dop.core.emitObservers(snapshot.mutations))
        dop.core.emitNodes(snapshot.getAction());
    return snapshot;
};