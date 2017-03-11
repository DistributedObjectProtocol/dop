
dop.core.invertMutation = function(objectTarget, mutation) {
    // newval
    if (!mutation.hasOwnProperty('oldValue')) {
        mutation.oldValue = mutation.value;
        delete mutation.value;
        delete objectTarget[mutation.name];
    }

    //delete
    else if (!mutation.hasOwnProperty('value')) {
        mutation.value = mutation.oldValue;
        delete mutation.oldValue;
        var value = dop.isObjectRegistrable(value) ?
            dop.core.configureObject(
                dop.util.merge(isArray(mutation.value) ? [] : {}, mutation.value),
                dop.getObjectDop(objectTarget).concat(mutation.name),
                mutation.object
            )
        :
            mutation.value;
        objectTarget[mutation.name] = value;
    }

    // set
    else {
        var tmp = mutation.oldValue;
        mutation.oldValue = mutation.value;
        mutation.value = tmp;
        var value = dop.isObjectRegistrable(value) ?
            dop.core.configureObject(
                dop.util.merge(isArray(mutation.value) ? [] : {}, mutation.value),
                dop.getObjectDop(objectTarget).concat(mutation.name),
                mutation.object
            )
        :
            mutation.value;
        objectTarget[mutation.name] = value;
    }
};

dop.core.invertSpliceMutation = function(objectTarget, mutation) {
    var splice = mutation.splice,
        spliced = (mutation.spliced === undefined) ? [] : mutation.spliced;

    mutation.splice = [splice[0], splice.length-2];
    Array.prototype.push.apply(mutation.splice, spliced);
    mutation.spliced = Array.prototype.splice.apply(objectTarget, mutation.splice);

    if (mutation.spliced.length === 0)
        delete mutation.spliced;
        
    return mutation;
};

dop.core.invertSwapMutation = function(objectTarget, mutation) {
    mutation.swaps.reverse();
    dop.core.swap(objectTarget, mutation.swaps);
    return mutation
};
