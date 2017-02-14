
dop.core.getAction = function(mutations) {

    var actions = {},
        index = 0,
        total = mutations.length,
        mutation,
        object_id;

    for (;index<total; ++index) {
        mutation = mutations[index];
        if (dop.core.objectIsStillStoredOnPath(mutation.object)) {// Only need it for arrays but is faster than injectMutation directly
            object_id = dop.getObjectId(mutation.object);
            if (actions[object_id] === undefined)
                actions[object_id] = {object:dop.getObjectRoot(mutation.object), action:{}};
            dop.core.injectMutationInAction(actions[object_id].action, mutation);
        }
    }

    return actions;
};