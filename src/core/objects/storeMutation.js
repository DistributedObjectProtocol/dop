
dop.core.storeMutation = function(mutation) {
    var object_dop = dop.getObjectDop(mutation.object);
    object_dop.m.push(mutation);
    dop.data.mutations.push(mutation);
};

// dop.core.storeMutation = function(mutation) {
//     var object_id = dop.getObjectId(mutation.object),
//         mutations = dop.data.object[object_id].mutations,
//         index = 0,
//         total = mutations.length;

//     for (;index<total; ++index) {
//         if (mutations[index].property === mutation.property && mutations[index].object === mutation.object) {
//             mutations.splice(index, 1);
//             break;
//         }
//     }

//     mutations.push(mutation);
//     dop.data.mutating[object_id] = true;
// };