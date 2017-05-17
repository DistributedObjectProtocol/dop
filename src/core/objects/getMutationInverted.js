
dop.core.getMutationInverted = function(mutation) {

    var mutationInverted = {
        object: mutation.object,
        path: mutation.path,
        prop: mutation.prop
    };

    // splice
    if (mutation.splice !== undefined) {
        var splice = mutation.splice,
            spliced = (mutation.spliced === undefined) ? [] : mutation.spliced;

        mutationInverted.splice = [splice[0], splice.length-2];
        Array.prototype.push.apply(mutationInverted.splice, spliced);

        mutationInverted.spliced = splice.slice(2);
        if (mutationInverted.spliced.length === 0)
            delete mutationInverted.spliced;
    }

    // swaps
    else if (mutation.swaps !== undefined)
        mutationInverted.swaps = mutation.swaps.slice(0).reverse();

    // new value
    else if (!mutation.hasOwnProperty('oldValue'))
        mutationInverted.oldValue = mutation.value;

    // delete
    else if (!mutation.hasOwnProperty('value'))
        mutationInverted.value = mutation.oldValue;

    // set
    else {
        mutationInverted.oldValue = mutation.value;
        mutationInverted.value = mutation.oldValue;
    }

    return mutationInverted;
};