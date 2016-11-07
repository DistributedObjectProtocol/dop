
dop.setAction = function(action, dontEmit) {
    var collector = dop.collectFirst();
    dop.util.path(action, dop.core.setActionProtocol, dop.data.object, false);
    if (dontEmit !== false)
        collector.emitAndDestroy();
    return collector;
};


dop.core.setActionProtocol = function(source, prop, value, destiny) {

    if (prop === CONS.dop)
        return true;

    if (dop.util.isObject(value) && value.hasOwnProperty(CONS.dop)) {

        var mutations = value[CONS.dop],
            mutation,
            index=0,
            total=mutations.length;

        if (!Array.isArray(destiny[prop]))
            dop.core.set(destiny, prop, []);

        for (;index<total; ++index) {
            mutation = mutations[index];
            // swaps
            if (mutation[0]<0 || mutation[1]<0) {
                (mutation[0]<0) ? mutation[0] = mutation[0]*-1 : mutation[1] = mutation[1]*-1;
                dop.core.swap(destiny[prop], mutation);
            }
            // set
            else if (mutation.length===3 && mutation[1]===0)
                dop.set(destiny[prop], mutation[0], mutation[2]);
            // splice
            else
                dop.core.splice(destiny[prop], mutation);
        }

    }

    else if (!dop.util.isObjectRegistrable(value))
        (value===undefined) ? 
            dop.del(destiny, prop)
        : 
            dop.set(destiny, prop, value);
};
