
dop.core.injectMutationInAction = function(action, mutation, isUnaction) {

    var isMutationArray = mutation.splice!==undefined || mutation.swaps!==undefined,
        path = dop.getObjectDop(mutation.object).slice(0),
        prop = mutation.name,
        value = (isUnaction) ? mutation.oldValue : mutation.value,
        typeofValue = dop.util.typeof(value),
        index = 1;


    if (!isMutationArray)
        path.push(prop);

    for (;index<path.length-1; ++index) {
        prop = path[index];
        action = isObject(action[prop]) ? action[prop] : action[prop]={};
    }

    prop = path[index];

    /*if (isMutationArray && isArray(action[prop])) {
        if (mutation.swaps!==undefined) {
            var swaps = mutation.swaps.slice(0);
            action[prop].reverse()
        }
    }
    else*/ if ((isMutationArray || isArray(mutation.object)) && prop !== 'length') {

        if (path.length>1) {
            if (isMutationArray && !isObject(action[prop])) 
                action[prop] = {};

            if (isMutationArray)
                action = action[prop];
        }

        if (!isObject(action[dop.cons.DOP]))
            action[dop.cons.DOP] = [];
            
        var mutations = action[dop.cons.DOP];

        // swap
        if (mutation.swaps!==undefined) {
            var swaps = mutation.swaps.slice(0);
            if (isUnaction)
                swaps.reverse();
            // var tochange = (swaps[0]>0) ? 0 : 1;
            // swaps[tochange] = swaps[tochange]*-1;
            swaps.unshift(0); // 0 mean swap
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
            
            splice.unshift(1); // 1 mean splice
            mutations.push(splice);
        }

        // set
        else
            mutations.push([1, prop, 1, value]);

        // We have to update the length of the array in case that is lower than before
        if (isUnaction && mutation.length!==undefined && mutation.length!==mutation.object.length)
            action.length = mutation.length;
    }

    // set
    else
        action[prop] = (typeofValue=='object' || typeofValue=='array') ? dop.util.merge(typeofValue=='array'?[]:{},value) : value;
};