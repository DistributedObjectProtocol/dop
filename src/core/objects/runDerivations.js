
dop.core.runDerivations = function(mutation) {
    if (dop.data.path[mutation.path_id] !== undefined && dop.data.path[mutation.path_id].derivations !== undefined) {
        var derivations = dop.data.path[mutation.path_id].derivations,
            computed,
            object,
            value,
            total = derivations.length,
            index = 0;

        for (;index<total; ++index) {
            computed = dop.data.computed[derivations[index]];
            object = dop.util.get(computed.object_root, computed.path);
            if (object !== undefined) {
                value = computed.function.call(object, object[computed.prop]);
                dop.core.set(object, computed.prop, value);
            }
        }
    }
};