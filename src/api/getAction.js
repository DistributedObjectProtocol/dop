
dop.getAction = function(mutations) {

    var action = {},
        index = 0,
        total = mutations.length;

    for (;index<total; ++index)
        if (dop.core.objectIsStillStoredOnPath(mutations[index].object))
            dop.util.injectMutationInAction(action, mutations[index]);

    return action;
};

dop.core.objectIsStillStoredOnPath = function(object) {

    var path = dop.getObjectDop(object),
        index = path.length-1,
        parent;

    for (;index>0; --index) {
        parent = (index>1) ? dop.getObjectDop(object)._ : dop.data.object[path[0]];
        if ( parent[path[index]] !== object )
            return false;
        object = dop.getObjectProxy(parent);
    }

    return true;
};

dop.util.injectMutationInAction = function(action, mutation) {

    var path = (mutation.path===undefined) ? dop.getObjectDop(mutation.object).slice(0).concat(mutation.name) : mutation.path,
        index = 0,
        total = path.length-1,
        objdeep;

    for (;index<total; ++index) {
        objdeep = action[path[index]];
        action = (dop.util.isObject(objdeep)) ? objdeep : action[path[index]]={};
    }

        // console.log( obj[path[index]], path );
    // if (Array.isArray(mutation.value) || mutation.splice!==undefined || mutation.swaps!==undefined) {
    //     console.log( 'isArray' );
    // } 
    // else
        action[path[index]] = mutation.value;
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
//             dop.getObjectDop(mutation.object).slice(0).concat(mutation.name)
//         :
//             mutation.path;

//         dop.util.set(action, path, mutation.value);
//     }

//     return action;
// };


