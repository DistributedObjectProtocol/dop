
dop.setAction = function(actions) {
    var collector = dop.collectFirst(), object_id;
    for (object_id in actions)
        dop.util.path({a:actions[object_id].action}, null, {a:actions[object_id].object}, dop.core.setAction);
    return collector;
};