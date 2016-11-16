
dop.util.injectMutationInAction = function(action, mutation, isUnaction) {

    var isMutationArray = mutation.splice!==undefined || mutation.swaps!==undefined,
        path = dop.getObjectDop(mutation.object).slice(0),
        object_data = dop.data.object,
        prop = mutation.name,
        value = (isUnaction) ? mutation.oldValue : mutation.value,
        typeofValue = dop.util.typeof(value),
        index = 0,
        isArray = Array.isArray,
        parent;


    if (!isMutationArray)
        path.push(prop);

    for (;index<path.length-1; ++index) {
        parent = action;
        prop = path[index];
        if (object_data!==undefined)
            object_data = object_data[prop];
        action = dop.util.isObject(action[prop]) ? action[prop] : action[prop]={};
    }

    prop = path[index];

    if (isMutationArray || isArray(object_data)) {

        if (isMutationArray && !dop.util.isObject(action[prop])) 
            action[prop] = {};

        if (isMutationArray)
            action = action[prop];

        if (!dop.util.isObject(action[CONS.dop]))
            action[CONS.dop] = [];
            
        var mutations = action[CONS.dop];

        // swap
        if (mutation.swaps!==undefined) {
            var swaps = mutation.swaps.slice(0);
            if (isUnaction)
                swaps.reverse();
            var tochange = (swaps[0]>0) ? 0 : 1;
            swaps[tochange] = swaps[tochange]*-1;
            mutations.push(swaps);
        }

        // splice
        else if (mutation.splice!==undefined) {
            var splice;
            if (isUnaction) {
                splice = (mutation.spliced) ? mutation.spliced.slice(0) : [];
                splice.unshift(mutation.splice[0], mutation.splice.length-2);
            }
            else
                splice = mutation.splice.slice(0);
                
            mutations.push(splice);
        }

        // set
        else
            mutations.push([prop, 1, value]);

        if (isUnaction && mutation.length!==undefined && mutation.length!==object_data.length)
            action.length = mutation.length;
    }

    // set
    else
        action[prop] = (typeofValue=='object' || typeofValue=='array') ? dop.util.merge(typeofValue=='array'?[]:{},value) : value;
};