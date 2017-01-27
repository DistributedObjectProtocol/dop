
dop.emit = function(mutations) {
    if (mutations.length>0) {
        // This is true if we have nodes subscribed to those object/mutations
        if (dop.core.emitObservers(mutations))
            dop.core.emitNodes(dop.getAction(mutations));
    }
};