
dop.core.setPatchMutator = function(destiny, prop, value, typeofValue, path) {

    var typeofDestinyParent = dop.util.typeof(destiny),
        typeofDestiny = dop.util.typeof(destiny[prop]);

    // Array mutations
    if (typeofValue=='object' && typeofDestiny=='array' && value.hasOwnProperty(dop.cons.DOP)) {

        var mutations = value[dop.cons.DOP],
            mutation,
            index=0,
            total=mutations.length,
            typeArrayMutation;

        // if (typeofDestiny!='array')
        //     dop.set(destiny, prop, []);

        for (;index<total; ++index) {
            typeArrayMutation = mutations[index][0]; // 0=swaps 1=splices
            mutation = mutations[index].slice(1);
            // swap
            if (typeArrayMutation===0) {
                // mutation = mutation.slice(0);
                // (mutation[0]<0) ? mutation[0] = mutation[0]*-1 : mutation[1] = mutation[1]*-1;
                dop.core.swap(destiny[prop], mutation);
            }
            // length
            else if (typeArrayMutation===2) {
                dop.set(destiny[prop], 'length', mutation[1]);
            }
            // splice & set & del
            else {
                // We have to update the length of the array in case that is lower than before
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

    else if (path.length > 1) {

        // Objects
        if (typeofValue=='object' && typeofDestiny!='object') //!destiny.hasOwnProperty(prop)
            dop.set(destiny, prop, {});

        // Arrays
        else if (typeofValue=='array' && typeofDestiny!='array')
            dop.set(destiny, prop, []);

        // Delete
        else if (typeofValue=='undefined')
            dop.del(destiny, prop);

        // Set value
        else if (typeofValue!='object')
            dop.set(destiny, prop, value);
    }
};