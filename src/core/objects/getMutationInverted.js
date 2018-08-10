dop.core.getMutationInverted = function(mutation) {
    var mutation_inverted = {
        object: mutation.object,
        path: mutation.path,
        prop: mutation.prop
    }

    // splice
    if (mutation.splice !== undefined) {
        var splice = mutation.splice,
            spliced = mutation.spliced === undefined ? [] : mutation.spliced

        mutation_inverted.splice = [splice[0], splice.length - 2]
        Array.prototype.push.apply(mutation_inverted.splice, spliced)

        mutation_inverted.spliced = splice.slice(2)
        if (mutation_inverted.spliced.length === 0)
            delete mutation_inverted.spliced
    }

    // swaps
    else if (mutation.swaps !== undefined)
        mutation_inverted.swaps = mutation.swaps.slice(0).reverse()
    // new value
    else if (!mutation.hasOwnProperty('old_value'))
        mutation_inverted.old_value = mutation.value
    // delete
    else if (!mutation.hasOwnProperty('value'))
        mutation_inverted.value = mutation.old_value
    // set
    else {
        mutation_inverted.old_value = mutation.value
        mutation_inverted.value = mutation.old_value
    }

    return mutation_inverted
}
