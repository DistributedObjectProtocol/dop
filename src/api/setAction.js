
dop.setAction = function(action) {
    var collector = dop.collectFirst();
    dop.util.path(action, dop.core.setActionProtocol, dop.data.object, false);
    collector.action = action;
    collector.emitAndDestroy();
    return collector;
};


dop.core.setActionProtocol = function(source, prop, value, destiny) {
    if (dop.util.isObject(value) && value.hasOwnProperty(CONS.dop)) {
        var mutations = value[CONS.dop],
            mutation,
            index=0,
            total=mutations.length;

        if (!Array.isArray(destiny[prop]))
            dop.core.set(dop.getObjectTarget(destiny), prop, []);

        for (;index<total; ++index) {
            mutation = mutations[index];
            if (mutation[0]<0 || mutation[1]<0) // swaps
                dop.core.swap.apply(destiny[prop], mutation);
            else // splice
                dop.core.splice.apply(destiny[prop], mutation);
        }

    }

    else if (prop!==CONS.dop && dop.isRegistered(destiny) && (dop.isRegistered(value) || !dop.util.isObject(value)))
        (value===undefined) ? 
            dop.del(destiny, prop)
        : 
            dop.set(destiny, prop, value);
};