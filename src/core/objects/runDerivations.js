
dop.core.runDerivations = function(path_id) {
    if (dop.data.path[path_id] !== undefined && dop.data.path[path_id].derivations !== undefined) {
        var derivations = dop.data.path[path_id].derivations,
            computed,
            object,
            value,
            total = derivations.length,
            index = 0;

        for (;index<total; ++index) {
            computed = dop.data.computed[derivations[index]];
            object = dop.util.get(computed.object_root, computed.path);
            if (object !== undefined)
                dop.core.set(
                    object,
                    computed.prop,
                    computed.function.call(object, object[computed.prop])
                );
        }
    }
};