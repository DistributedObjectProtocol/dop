
dop.core.setAction = function(object, action) {
    dop.util.path({0:action}, null, {0:object}, dop.core.setActionMutator);
    return object;
};

dop.core.setActions = function(actions) {
    var collector = dop.collectFirst(), object_id;
    for (object_id in actions)
        dop.core.setAction(actions[object_id].object, actions[object_id].action);
    return collector;
};