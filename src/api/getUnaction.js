
dop.getUnaction = function(mutations) {

    var actions = {},
        index = mutations.length-1,
        object_id,
        mutation;

    for (;index>-1; --index) {
        mutation = mutations[index];
        object_id = dop.getObjectId(mutation.object);
        if (actions[object_id] === undefined)
            actions[object_id] = {object:dop.getObjectRoot(mutation.object), action:{}};
        dop.core.injectMutationInAction(actions[object_id].action, mutation, true);
    }

    return actions;
};