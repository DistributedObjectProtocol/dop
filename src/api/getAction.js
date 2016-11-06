
dop.getAction = function(mutations) {

    var action = {},
        index = 0,
        total = mutations.length;

    for (;index<total; ++index)
        if (dop.core.objectIsStillStoredOnPath(mutations[index].object)) // Only need it for arrays but is faster than injectMutation directly
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
        parent, object;


    if (!isMutationArray) {
        path.push(mutation.name);
        total += 1;
    }

    for (;index<total; ++index) {
        parent = action;
        object = action[path[index]];
        action = (dop.util.isObject(object)) ? object : action[path[index]]={};
    }

    if (isArray(mutation.object) || isArray(value)) {

        prop = path[index];
        if (!isMutationArray && isArray(mutation.object)) {
            prop = path[index-1];
            action = parent;
        }

        if (!dop.util.isObject(action[prop])) 
            action[prop] = {};

        if (!dop.util.isObject(action[prop][CONS.dop]))
            action[prop][CONS.dop] = [];


        var mutations = action[prop][CONS.dop];

        // new array
        if (isArray(value)) {
            mutations.push([0]);
            if (value.length>0) {
                value = mutation.valueOriginal.slice(0);
                value.unshift(0,0);
                mutations.push(value);
            }
        }

        // splice
        else if (mutation.splice!==undefined)
            mutations.push(mutation.splice);

        // swaps
        else if (mutation.swaps!==undefined) {
            var swaps = mutation.swaps.slice(0),
                tochange = (swaps[0]>0) ? 0 : 1;
            swaps[tochange] = swaps[tochange]*-1;
            mutations.push(swaps);
        }

        // set
        else
            mutations.push([mutation.name, 0, mutation.value]);
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


