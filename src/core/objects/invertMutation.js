
// dop.core.invertMutation = function(mutation) {
//     var objectTarget = dop.getObjectTarget(mutation.object);
//     // newval
//     if (!mutation.hasOwnProperty('oldValue')) {
//         mutation.oldValue = mutation.value;
//         delete mutation.value;
//         delete objectTarget[mutation.name];
//     }

//     //delete
//     else if (!mutation.hasOwnProperty('value')) {
//         mutation.value = mutation.oldValue;
//         delete mutation.oldValue;
//         var value = dop.isObjectRegistrable(mutation.value) ?
//             dop.core.configureObject(
//                 dop.util.merge(isArray(mutation.value) ? [] : {}, mutation.value),
//                 dop.getObjectDop(objectTarget).concat(mutation.name),
//                 mutation.object
//             )
//         :
//             mutation.value;
//         objectTarget[mutation.name] = value;
//     }

//     // set
//     else {
//         var tmp = mutation.oldValue;
//         mutation.oldValue = mutation.value;
//         mutation.value = tmp;
//         var value = dop.isObjectRegistrable(mutation.value) ?
//             dop.core.configureObject(
//                 dop.util.merge(isArray(mutation.value) ? [] : {}, mutation.value),
//                 dop.getObjectDop(objectTarget).concat(mutation.name),
//                 mutation.object
//             )
//         :
//             mutation.value;
//         objectTarget[mutation.name] = value;
//     }
// };

// dop.core.invertSpliceMutation = function(mutation) {
//     var objectTarget = dop.getObjectTarget(mutation.object[mutation.name]),
//         splice = mutation.splice,
//         spliced = (mutation.spliced === undefined) ? [] : mutation.spliced;

//     mutation.splice = [splice[0], splice.length-2];
//     Array.prototype.push.apply(mutation.splice, spliced);
//     mutation.spliced = Array.prototype.splice.apply(objectTarget, mutation.splice);

//     if (mutation.spliced.length === 0)
//         delete mutation.spliced;
        
//     return mutation;
// };

// dop.core.invertSwapMutation = function(mutation) {
//     var objectTarget = dop.getObjectTarget(mutation.object[mutation.name]);
//     mutation.swaps.reverse();
//     dop.core.swap(objectTarget, mutation.swaps);
//     return mutation
// };
