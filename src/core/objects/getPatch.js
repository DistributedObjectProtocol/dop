
dop.core.getPatch = function(mutations) {

    var patchs = {},
        index = 0,
        total = mutations.length,
        mutation,
        object_id;

    for (;index<total; ++index) {
        mutation = mutations[index];
        // if (dop.core.objectIsStillStoredOnPath(mutation.object)) {// Only need it for arrays but is faster than injectMutation directly
        object_id = dop.getObjectId(mutation.object);
        if (patchs[object_id] === undefined)
            patchs[object_id] = {object:dop.getObjectRoot(mutation.object), patch:{}};
        dop.core.injectMutationInPatch(patchs[object_id].patch, mutation);
        // }
    }

    return patchs;
};



// dop.core.objectIsStillStoredOnPath = function(object) {

//     var path = dop.getObjectDop(object),
//         index = path.length-1,
//         parent;

//     for (;index>0; --index) {
//         // parent = (index>1) ? dop.getObjectDop(object)._ : dop.data.object[path[0]];
//         if (index>1) {
//             parent = dop.getObjectParent(object);
//             if (parent[path[index]] !== object)
//                 return false;
//             object = dop.getObjectProxy(parent);
//         }
//         // else
//             // return false;
//     }

//     return true;
// };