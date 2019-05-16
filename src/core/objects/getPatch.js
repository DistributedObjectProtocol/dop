dop.core.getPatch = function(mutations, is_unpatch) {
    var patchs = {},
        index = 0,
        total = mutations.length,
        mutation,
        object_id

    for (; index < total; ++index) {
        mutation = is_unpatch
            ? dop.core.getMutationInverted(mutations[index])
            : mutations[index]
        object_id = dop.getObjectId(mutation.object)
        if (patchs[object_id] === undefined)
            patchs[object_id] = {
                chunks: [{}],
                object: dop.getObjectRoot(mutation.object)
            }
        dop.core.injectMutationInPatch(patchs[object_id], mutation)
        // console.log(JSON.stringify(patchs[object_id].chunks))
    }

    return patchs
}
