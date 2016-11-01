
dop.emit = function(mutations, action) {
    if (mutations.length>0) {
        // This is true if we have nodes subscribed to those object/mutations
        if (dop.core.emitObservers(mutations)) {
            if (action === undefined)
                action = dop.getAction(mutations);
            dop.core.emitNodes(action);
        }
    }
};