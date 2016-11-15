
dop.setAction = function(action) {
    var collector = dop.collectFirst();
    dop.core.setAction(action, dop.data.object);
    return collector;
};


dop.core.setAction = function(action, destiny) {
    return dop.util.path(action, null, destiny, dop.core.setActionMutator);
};
dop.core.setActionMutator = function(destiny, prop, value, typeofValue, path) {

    // if (path.length > 1) {

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
                    dop.core.set(destiny[prop], mutation[0], mutation[2]);
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
    // }
};
// dop.core.setActionLoop = function() {
//     if (prop === CONS.dop)
//         return true;
// };


