
dop.getAction = function(mutations) {

    var action = {},
        index = 0,
        total = mutations.length;

    for (;index<total; ++index)
        if (dop.core.objectIsStillStoredOnPath(mutations[index].object)) // Only need it for arrays but is faster than injectMutation directly
            dop.util.injectMutationInAction(action, mutations[index]);

    return action;
};

dop.util.injectMutationInAction = function(action, mutation) {
var act=action;
    var isMutationArray = mutation.splice!==undefined || mutation.swaps!==undefined,
        path = dop.getObjectDop(mutation.object).slice(0),
        object = dop.data.object,
        prop = mutation.name,
        value = mutation.object[prop],
        typeofValue = dop.util.typeof(value),
        index = 0,
        isArray = Array.isArray,
        parent;


    if (!isMutationArray)
        path.push(prop);

    for (;index<path.length-1; ++index) {
        parent = action;
        prop = path[index];
        object = object[prop];
        action = action.hasOwnProperty(prop) ? action[prop] : action[prop]={};
    }

    prop = path[index];

    if (isMutationArray || isArray(object)) {

        if (isMutationArray && !dop.util.isObject(action[prop])) 
            action[prop] = {};

        if (isMutationArray)
            action = action[prop];

        if (!dop.util.isObject(action[CONS.dop]))
            action[CONS.dop] = [];
            
        var mutations = action[CONS.dop];

        // splice
        if (mutation.splice!==undefined)
            mutations.push(mutation.splice.slice(0));

        // swap
        else if (mutation.swaps!==undefined) {
            var swaps = mutation.swaps.slice(0),
                tochange = (swaps[0]>0) ? 0 : 1;
            swaps[tochange] = swaps[tochange]*-1;
            mutations.push(swaps);
        }

        // set
        else
            mutations.push([prop, 1, value]);
    }

    // set
    else
        action[prop] = (typeofValue=='object' || typeofValue=='array') ? dop.util.merge(typeofValue=='array'?[]:{},value) : value;
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




    // if (isArray(mutation.object) || typeofValue=='array') {

    //     prop = path[index];
    //     if (!isMutationArray && isArray(mutation.object)) {
    //         prop = path[index-1];
    //         action = parent;
    //     }

    //     if (!dop.util.isObject(action[prop])) 
    //         action[prop] = {};

    //     if (!dop.util.isObject(action[prop][CONS.dop]))
    //         action[prop][CONS.dop] = [];


    //     var mutations = action[prop][CONS.dop];

    //     // new array
    //     if (typeofValue=='array') {
    //         mutations.push([0]);
    //         if (value.length>0) {
    //             value = mutation.valueOriginal.slice(0);
    //             value.unshift(0,0);
    //             mutations.push(value);
    //         }
    //     }

    //     // splice
    //     else if (mutation.splice!==undefined)
    //         mutations.push(mutation.splice);

    //     // swaps
    //     else if (mutation.swaps!==undefined) {
    //         var swaps = mutation.swaps.slice(0),
    //             tochange = (swaps[0]>0) ? 0 : 1;
    //         swaps[tochange] = swaps[tochange]*-1;
    //         mutations.push(swaps);
    //     }

    //     // set
    //     else
    //         mutations.push([mutation.name, 0, value]);
    // }

    // else
