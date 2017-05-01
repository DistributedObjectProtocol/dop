
dop.core.injectMutationInPatch = function(patch, mutation) {

    var isMutationArray = mutation.splice!==undefined || mutation.swaps!==undefined,
        prop = mutation.prop,
        path = mutation.path,
        value = mutation.value,
        typeofValue = dop.util.typeof(value),
        index = 1;



    // Going deep
    for (;index<path.length; ++index) {
        propPath = path[index];

        patch = isObject(patch[propPath]) ?
            isObject(patch[propPath][dop.cons.DOP]) ? patch[propPath][dop.cons.DOP] : patch[propPath]
        :
            patch[propPath] = {};
    }




/*
    // Its a new array like {myarray:[1,2,3]} we must apply mutations
    if (isMutationArray && isArray(patch[prop])) {
        // Swaps
        if (mutation.swaps!==undefined)
            dop.util.swap(patch[prop], mutation.swaps.slice(0));
        // Splice
        else if (mutation.splice!==undefined)
            Array.prototype.splice.apply(patch[prop], mutation.splice.slice(0));
    }


    // // Its an array and we must apply mutations
    else if (isMutationArray) {

        if (!isObject(patch[prop]) || !isObject(patch[prop][dop.cons.DOP])) {
            patch[prop] = {}
            patch[prop][dop.cons.DOP] = [];
        }
            
        var mutations = patch[prop][dop.cons.DOP];

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


    // setting a new object: miobject.prop = {new:"object"}
    else */if (typeofValue == 'object') {
        var newValue = {};
        newValue[dop.cons.DOP] = dop.util.merge({}, value);
        patch[prop] = newValue;
    }
    // setting a new array: miobject.prop = [1,2,3]
    else if (typeofValue == 'array')
        patch[prop] = dop.util.merge([], value);

    // setting other values
    else
        patch[prop] = value;
};


// a=
// {
//     "a": 1234, // new number
//     "c": [], // new array
//     "b": {"~DOP":{}}, // new object
//     "d": {"~DOP":[ [...], {"2":{caca:123}} ]} // mutations over existing array   
// }

