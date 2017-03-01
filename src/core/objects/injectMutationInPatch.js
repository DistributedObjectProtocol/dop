
dop.core.injectMutationInPatch = function(patch, mutation) {

    var isMutationArray = mutation.splice!==undefined || mutation.swaps!==undefined,
        path = dop.getObjectDop(mutation.object).slice(0),
        prop = mutation.name,
        value = mutation.value,
        typeofValue = dop.util.typeof(value),
        index = 1;

    // If is an array or an object we must make a copy
    if (typeofValue == "object")
        value = dop.util.merge({}, value);
    else if (typeofValue == "array")
        value = dop.util.merge([], value);


    if (!isMutationArray)
        path.push(prop);

    // Going deep
    for (;index<path.length-1; ++index) {
        prop = path[index];
        patch = isObject(patch[prop]) ? patch[prop] : patch[prop]={};
    }

    prop = path[index];

    // Its a new array like {myarray:[1,2,3]} we must apply mutations
    if (isMutationArray && isArray(patch[prop])) {
        // Swaps
        if (mutation.swaps!==undefined)
            dop.util.swap(patch[prop], mutation.swaps.slice(0))
        // Splice
        else if (mutation.splice!==undefined)
            Array.prototype.splice.apply(patch[prop], mutation.splice.slice(0));
    }

    else if (isArray(patch))
        patch[prop] = value;


    // Its an array and we must apply mutations
    else if (isMutationArray || isArray(mutation.object)) {

        if (path.length>1) {
            if (isMutationArray && !isObject(patch[prop])) 
                patch[prop] = {};

            if (isMutationArray)
                patch = patch[prop];
        }

        if (!isObject(patch[dop.cons.DOP]))
            patch[dop.cons.DOP] = [];
            
        var mutations = patch[dop.cons.DOP];

        // swap
        if (mutation.swaps!==undefined) {
            var swaps = mutation.swaps.slice(0);
            // var tochange = (swaps[0]>0) ? 0 : 1;
            // swaps[tochange] = swaps[tochange]*-1;
            swaps.unshift(0); // 0 mean swap
            mutations.push(swaps);
        }

        // splice
        else if (mutation.splice!==undefined) {
            var splice = mutation.splice.slice(0);
            splice.unshift(1); // 1 mean splice
            mutations.push(splice);
        }

        // length
        else if (isArray(mutation.object) && mutation.name==='length')
            mutations.push([2, value]); // 2 means length

        // set
        else if (!isNaN(Number(prop)))
            mutations.push([1, Number(prop), 1, value]);
    }

    // set
    else
        patch[prop] = value;
};