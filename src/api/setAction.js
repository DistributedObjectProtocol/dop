
dop.setAction = function(action, dontEmit) {
    var collector = dop.collectFirst();
    dop.util.path(action, null, dop.data.object, dop.setActionMutator);
    if (dontEmit !== false)
        collector.emitAndDestroy();
    return collector;
};

// dop.core.setActionLoop = function() {
//     if (prop === CONS.dop)
//         return true;
// };

dop.setActionMutator = function(destiny, prop, value, typeofValue, path) {

    if (path.length > 1) {

        var typeofDestiny = dop.util.typeof(destiny[prop]);

        // Array mutations
        if (typeofValue=='object' && value.hasOwnProperty(CONS.dop)) {

            var mutations = value[CONS.dop],
                mutation,
                index=0,
                total=mutations.length;

            if (typeofDestiny!='array')
                dop.core.set(destiny, prop, []);

            for (;index<total; ++index) {
                mutation = mutations[index];
                // swaps
                if (mutation[0]<0 || mutation[1]<0) {
                    mutation = mutation.slice(0);
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


            return true; // Skiping to dont go inside of dop object/mutations
        }

        else {

            // Deeply
            if (typeofValue=='object' && typeofDestiny!='object') {
                dop.core.set(destiny, prop, {});
            }

            // Delete
            else if (typeofValue=='undefined')
                dop.core.delete(destiny, prop);


            // Set array and skip path deep
            else if (typeofValue=='array') {
                dop.core.set(destiny, prop, dop.util.merge([], value));
                return true;
            }

            // Set value
            else if (typeofValue!='object')
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
