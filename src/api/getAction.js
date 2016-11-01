
dop.getAction = function(mutations) {

    var action = {},
        index = 0,
        total = mutations.length,
        mutation,
        path;

    for (;index<total; ++index) {
        mutation = mutations[index];
        path = (mutation.path===undefined) ? dop.getObjectDop(mutation.object).slice(0).concat(mutation.name) : mutation.path;
        // dop.util.mergeMutation(action, path, mutation);
        console.log( mutation.object["~dop"].slice(0) );
    }

    return action;
};

dop.util.mergeMutation = function(object, path, mutation) {

    if (path.length == 0)
        return object;

    path = path.slice(0);
    var obj = object, objdeep, index=0, total=path.length-1;

    for (;index<total; ++index) {
        objdeep = obj[path[index]];
        obj = (objdeep && typeof objdeep == 'object') ?
            objdeep
        :
            obj[path[index]] = {};
    }

        console.log( obj[path[index]], path );
    if (Array.isArray(mutation.value) || mutation.splice!==undefined || mutation.swaps!==undefined) {
        console.log( 'isArray' );
    } 
    else
        obj[path[index]] = mutation.value;

    return object;
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


