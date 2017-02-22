
dop.core.invertMutation = function(object, mutation) {
    // newval
    if (!mutation.hasOwnProperty('oldValue')) {
        mutation.oldValue = mutation.value;
        delete mutation.value;
        delete object[mutation.name];
    }

    //delete
    else if (!mutation.hasOwnProperty('value')) {
        mutation.value = mutation.oldValue;
        delete mutation.oldValue;
        object[mutation.name] = mutation.value;
    }

    // set
    else {
        var tmp = mutation.oldValue;
        mutation.oldValue = mutation.value;
        mutation.value = tmp;
        object[mutation.name] = mutation.value;
    }
};

dop.core.invertSpliceMutation = function(object, mutation) {
    var splice = mutation.splice,
        spliced = (mutation.spliced === undefined) ? [] : mutation.spliced;

    mutation.splice = [splice[0], splice.length-2];
    Array.prototype.push.apply(mutation.splice, spliced);
    mutation.spliced = Array.prototype.splice.apply(object, mutation.splice);

    if (mutation.spliced.length === 0)
        delete mutation.spliced;
        
    return mutation;
};

dop.core.invertSwapMutation = function(object, mutation) {
    mutation.swaps.reverse();
    dop.core.swap(object, mutation.swaps);
    return mutation
};
