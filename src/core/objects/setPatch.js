dop.core.setPatch = function(object, patch, mutator) {
    if (!isArray(patch)) patch = [patch]

    for (var index = 0, total = patch.length; index < total; ++index)
        dop.util.path(patch[index], null, object, mutator)

    return object
}

dop.core.setPatchFunctionMutator = function(
    destiny,
    prop,
    value,
    tof_value,
    path
) {
    if (isFunction(value) && value._name == dop.cons.REMOTE_FUNCTION_UNSETUP)
        dop.set(destiny, prop, value(dop.getObjectId(destiny), path.slice(0)))
    else return dop.core.setPatchMutator(destiny, prop, value, tof_value, path)
}

dop.core.setPatchMutator = function(destiny, prop, value, tof_value) {
    var type_instruction,
        instructions_patchs = dop.protocol.instructionsPatchs,
        mutation

    // console.log( prop, tof_value, value );
    if (tof_value == 'array') {
        type_instruction = value[0]

        // Delete
        if (type_instruction === instructions_patchs.delete) {
            dop.del(destiny, prop)
        }

        // New object/array
        else if (type_instruction === instructions_patchs.object) {
            dop.set(destiny, prop, dop.util.clone(value[1]))
        }

        // Array mutations
        else if (isArray(destiny[prop])) {
            if (!isArray(type_instruction)) value = [value]

            for (var index = 0, total = value.length; index < total; ++index) {
                mutation = value[index]

                // Splice
                if (mutation[0] === instructions_patchs.splice)
                    dop.core.splice(destiny[prop], mutation[1])
                else if (mutation[0] === instructions_patchs.swaps)
                    dop.core.swap(destiny[prop], mutation[1])
            }
        }

        return true // Skiping to dont go inside of [instructionPatch, ...]
    }

    // Set value
    else if (tof_value != 'object') {
        dop.set(destiny, prop, value)
    }
}

// // Array mutations
// if (tof_value=='object' && typeofDestiny=='array' && value.hasOwnProperty(dop.cons.DOP)) {

//     var mutations = value[dop.cons.DOP],
//         mutation,
//         index=0,
//         total=mutations.length,
//         typeArrayMutation;

//     // if (typeofDestiny!='array')
//     //     dop.set(destiny, prop, []);

//     for (;index<total; ++index) {
//         typeArrayMutation = mutations[index][0]; // 0=swaps 1=splices
//         mutation = mutations[index].slice(1);

//         // swap
//         if (typeArrayMutation===0)
//             dop.core.swap(destiny[prop], mutation);

//         // length
//         else if (typeArrayMutation===2)
//             dop.set(destiny[prop], 'length', mutation[0]);

//         // splice & set & del
//         else {
//             // We have to update the length of the array in case that is lower than before
//             if (destiny[prop].length<mutation[0])
//                 dop.getObjectTarget(destiny[prop]).length = mutation[0];

//             // set
//             if (mutation.length===3 && mutation[1]===1) {
//                 (mutation[2] === undefined) ?
//                     dop.del(destiny[prop], mutation[0])
//                 :
//                     dop.set(destiny[prop], mutation[0], mutation[2]);
//             }

//             // splice
//             else
//                 dop.core.splice(destiny[prop], mutation);
//         }
//     }

//     // if (typeof value.length == 'number' && value.length>-1)
//         // destiny[prop].length = value.length;

//     return true; // Skiping to dont go inside of {~dop:...}
// }

// else //if (path.length > 1) {

//     // Objects
//     if (tof_value=='object' && typeofDestiny!='object') //!destiny.hasOwnProperty(prop)
//         dop.set(destiny, prop, {});

//     // Arrays
//     else if (tof_value=='array' && typeofDestiny!='array')
//         dop.set(destiny, prop, []);

//     // Delete
//     else if (tof_value=='undefined')
//         dop.del(destiny, prop);

//     // Set value
//     else if (tof_value!='object')
//         dop.set(destiny, prop, value);
// //}
