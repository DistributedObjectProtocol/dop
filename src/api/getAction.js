
dop.getAction = function(mutations) {

    var action = {},
        index = 0,
        total = mutations.length;

    for (;index<total; ++index)
        if (dop.core.objectIsStillStoredOnPath(mutations[index].object)) // Only need it for arrays but is faster than injectMutation directly
            dop.util.injectMutationInAction(action, mutations[index]);

    return action;
};

dop.core.objectIsStillStoredOnPath = function(object) {

    var path = dop.getObjectDop(object),
        index = path.length-1,
        parent;

    for (;index>0; --index) {
        parent = (index>1) ? dop.getObjectDop(object)._ : dop.data.object[path[0]];
        if (parent[path[index]] !== object)
            return false;
        object = dop.getObjectProxy(parent);
    }

    return true;
};