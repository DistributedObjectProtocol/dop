
dop.core.setPatch = function(object, patch) {
    dop.util.path({0:patch}, null, {0:object}, dop.core.setPatchMutator);
    return object;
};

dop.core.setPatchs = function(patchs) {
    var collector = dop.collectFirst(), object_id;
    for (object_id in patchs)
        dop.core.setPatch(patchs[object_id].object, patchs[object_id].patch);
    return collector;
};