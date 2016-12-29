
dop.setAction = function(actions) {
    var collector = dop.collectFirst(), object_id;
    for (object_id in actions)
        dop.core.setActionLocal(actions[object_id].object, actions[object_id].action);
    return collector;
};