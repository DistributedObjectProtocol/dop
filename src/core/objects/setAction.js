
dop.core.setAction = function(actions) {
    var collector = dop.collectFirst(), object_id;
    for (object_id in actions)
        dop.util.path({a:actions[object_id].action}, null, {a:actions[object_id].object}, dop.core.setActionMutator)
    return collector;
};

/*
dop.setAction = function(actions) {
    var collector = dop.collectFirst(), object_id;
    for (object_id in actions)
        dop.core.setAction(actions[object_id].object, actions[object_id].action);
    return collector;
};
dop.core.setAction = function(object, action) {
    dop.util.path({a:action}, null, {a:object}, dop.core.setActionMutator);
    return object;
};
*/