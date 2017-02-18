
dop.core.getUnpatch = function(mutations) {

    var patchs = {},
        index = mutations.length-1,
        object_id,
        mutation;

    for (;index>-1; --index) {
        mutation = mutations[index];
        object_id = dop.getObjectId(mutation.object);
        if (patchs[object_id] === undefined)
            patchs[object_id] = {object:dop.getObjectRoot(mutation.object), patch:{}};
        dop.core.injectMutationInPatch(patchs[object_id].patch, mutation, true);
    }

    return patchs;
};