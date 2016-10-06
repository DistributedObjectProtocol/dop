
dop.emit = function(mutations, action) {
    if (mutations.length>0) {
        // if mutations With Nodes
        if ( dop.core.emitObservers(mutations) ) {
            if (action === undefined)
                action = dop.getAction(mutations);
            dop.core.emitNodes(action);
        }
    }
};