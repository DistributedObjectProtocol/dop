
dop.setAction = function( action ) {
    var collector = dop.collect();
    dop.util.path(action, function(source, prop, value, destiny) {
        if (dop.isRegistered(destiny) && (dop.isRegistered(value) || !dop.util.isObject(value))) {
            (value===undefined) ? 
                dop.delete(destiny, prop)
            : 
                dop.set(destiny, prop, value);
        }
    }, dop.data.object, false);
    collector.action = action;
    return collector.emit();
};