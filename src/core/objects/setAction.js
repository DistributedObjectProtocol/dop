
dop.core.setAction = function(destiny, prop, value, typeofValue, path) {

    // if (path.length > 1) {

        var typeofDestiny = dop.util.typeof(destiny[prop]);

        // Array mutations
        if (typeofValue=='object' && value.hasOwnProperty(dop.cons.DOP)) {

            var mutations = value[dop.cons.DOP],
                mutation,
                index=0,
                total=mutations.length;

            if (typeofDestiny!='array')
                dop.set(destiny, prop, []);

            for (;index<total; ++index) {
                mutation = mutations[index];
                // swaps
                if (mutation[0]<0 || mutation[1]<0) {
                    mutation = mutation.slice(0);
                    (mutation[0]<0) ? mutation[0] = mutation[0]*-1 : mutation[1] = mutation[1]*-1;
                    dop.core.swap(destiny[prop], mutation);
                }
                // set
                else {
                    if (destiny[prop].length<mutation[0])
                        dop.getObjectTarget(destiny[prop]).length = mutation[0];
                    // set
                    if (mutation.length===3 && mutation[1]===1) {
                        (mutation[2] === undefined) ?
                           dop.del(destiny[prop], mutation[0])
                        :
                            dop.set(destiny[prop], mutation[0], mutation[2]);
                    }
                    // splice
                    else
                        dop.core.splice(destiny[prop], mutation);
                }
            }

            if (typeof value.length == 'number' && value.length>-1)
                destiny[prop].length = value.length;


            return true; // Skiping to dont go inside of {~dop:...}
        }

        else {

            // Deeply
            if (typeofValue=='object' && !destiny.hasOwnProperty(prop))
                dop.set(destiny, prop, {});

            // Delete
            else if (typeofValue=='undefined')
                dop.del(destiny, prop);

            // Set array and skip path deep
            else if (typeofValue=='array') {
                dop.set(destiny, prop, dop.util.merge([], value));
                return true;
            }

            // Set array and skip path deep
            else if (typeofValue=='object' && typeofDestiny!='object' && typeofDestiny!='array') {
                dop.set(destiny, prop, dop.util.merge({}, value));
                return true;
            }

            // Set value
            else if (typeofValue!='object')
                dop.set(destiny, prop, value);

        }
    // }
};
// dop.core.setActionLoop = function() {
//     if (prop === dop.cons.DOP)
//         return true;
// };
