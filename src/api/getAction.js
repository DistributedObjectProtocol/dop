
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

    var path = (mutation.path===undefined) ? dop.getObjectDop(mutation.object).slice(0).concat(mutation.name) : mutation.path,
        index = 0,
        mutationArray = (mutation.splice!==undefined || mutation.swaps!==undefined),
        total = path.length-((mutationArray) ? 2 : 1),
        objdeep,
        value = mutation.value,
        isArray = Array.isArray;


    for (;index<total; ++index) {
        objdeep = action[path[index]];
        action = (dop.util.isObject(objdeep)) ? objdeep : action[path[index]]={};
    }


    var object = objdeep, prop = path[index];
    if (isArray(mutation.object) || isArray(value)) {
        
        // Making defaults
        if (isArray(value) || !dop.util.isObject(action[prop]) || isArray(action[prop]))
            action[prop] = {};
        var arrayMutations = (isArray(action[prop][CONS.dop])) ? 
            action[prop][CONS.dop]
        : 
            action[prop][CONS.dop] = [];


console.log( path );
        // Setting a property but representing it as splice instruction
        if (isArray(object)) {

        }
        // Setting a new array
        else if (isArray(value)) {
            arrayMutations.push([0]);
            if (value.length>0) {
                var items = value.slice(0);
                items.unshift(0, 0);
                arrayMutations.push(items);
            }
        }
    }

    else
        action[prop] = value;


};





action = {
    1: {
        hola: "cruel",
        array: {
            "~dop": [
                [0], // set new array as empty
                [0, 0, 'String'], // set
                [1, 0, {object:'data'}] // set
                [0, 1], // splice
            ],
            "0": {object:"Changed"}
        }
    }
}





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


