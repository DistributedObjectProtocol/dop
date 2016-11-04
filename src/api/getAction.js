
dop.getAction = function(mutations) {

    var action = {},
        index = 0,
        total = mutations.length;

    for (;index<total; ++index)
        if (dop.core.objectIsStillStoredOnPath(mutations[index].object)) // Only need it for arrays but is faster than injectMutation
            dop.util.injectMutationInAction(action, mutations[index]);

    return action;
};

dop.core.objectIsStillStoredOnPath = function(object) {

    var path = dop.getObjectDop(object),
        index = path.length-1,
        parent;

    for (;index>0; --index) {
        parent = (index>1) ? dop.getObjectDop(object)._ : dop.data.object[path[0]];
        if (parent[path[index]] !== object)
            return false;
        object = dop.getObjectProxy(parent);
    }

    return true;
};

dop.util.injectMutationInAction = function(action, mutation) {

    var isMutationArray = mutation.splice!==undefined || mutation.swaps!==undefined,
        path = dop.getObjectDop(mutation.object).slice(0),
        index = 0,
        total = path.length-1,
        object = mutation.object,
        prop = mutation.name,
        value = mutation.value,
        isArray = Array.isArray,
        parent;


    if (!isMutationArray) {
        path.push(mutation.name);
        total += 1;
    }


    for (;index<total; ++index) {
        parent = action[path[index]];
        action = (dop.util.isObject(parent)) ? parent : action[path[index]]={};
    }


    if (isMutationArray || isArray(mutation.object) || isArray(value)) {

        prop = path[index];

        if (isArray(value) || !dop.util.isObject(action[prop]) || !dop.util.isObject(action[prop][CONS.dop])) {
            action[prop] = {};
            action[prop][CONS.dop] = [[0]];
        }
        // set
        else if (isArray(mutation.object))
            action[CONS.dop].push([mutation.name, 0, mutation.value]);
        // splice
        else if (mutation.splice!==undefined)
            action[prop][CONS.dop].push(mutation.splice);
        // swaps
        else if (mutation.swaps!==undefined) {
            var swaps = mutation.swaps.slice(0),
                tochange = (swaps[0]>0) ? 0 : 1;
            swaps[tochange] = swaps[tochange]*-1;
            action[prop][CONS.dop].push(swaps);
        }
    }

    else
        action[prop] = value;



};





// action = {
//     1: {
//         hola: "cruel",
//         array: {
//             "~dop": [
//                 [0], // set new array as empty
//                 [0, 0, 'String'], // set
//                 [1, 0, {object:'data'}] // set
//                 [0, 1], // splice
//                 [-0, 1], // move
//             ],
//             "0": {object:"Changed"}
//         }
//     }
// }





// dop.getAction = function(mutations) {

//     var action = {},
//         index = 0,
//         total = mutations.length,
//         mutation,
//         path;

//     for (;index<total; ++index) {
//         mutation = mutations[index];
//         path = (mutation.path===undefined) ?
//             dop.getObjectDop(mutation.object).slice(0).concat(prop)
//         :
//             mutation.path;

//         dop.util.set(action, path, value);
//     }

//     return action;
// };


