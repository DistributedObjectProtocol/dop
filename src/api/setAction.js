
dop.setAction = function(action, dontEmit) {
    var collector = dop.collectFirst();
    dop.util.path(action, dop.core.setActionLoop, dop.data.object, dop.setActionMutator);
    if (dontEmit !== false)
        collector.emitAndDestroy();
    return collector;
};

dop.core.setActionLoop = function(source, prop, value, destiny, path) {
    if (prop === CONS.dop)
        return true;
};

dop.setActionMutator = function(destiny, prop, value, typeofValue, path) {

    if (path.length > 1) {

        var valueIsObjectRegistrable = (typeofValue=='object' || typeofValue=='array'),
            destinyTypeof = dop.util.typeof(destiny[prop]);


        if (valueIsObjectRegistrable && destinyTypeof!='object' && destinyTypeof!='array') {
            if (destinyTypeof == 'object')
                1+1;
            else if (destinyTypeof == 'array')
                2+2;

            dop.core.set(destiny, prop, (typeofValue == 'array') ? [] : {});
        }

        // Delete
        else if (typeofValue=='undefined')
            dop.core.delete(destiny, prop);

        // Set
        else if (!valueIsObjectRegistrable) {
            if (typeofValue=='object')
                value = dop.util.merge({}, value);
            if (typeofValue=='array')
                value = dop.util.merge([], value);
            dop.core.set(destiny, prop, value);
        }
    }
};





/*
    // Array mutations
    if (typeofValue=='object' && value.hasOwnProperty(CONS.dop)) {

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
    
    // Extending
    else*/ 
