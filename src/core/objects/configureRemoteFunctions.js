dop.core.configureRemoteFunctions = function(node, object, object_owner_id) {
    dop.util.path(object, function(source, prop, value, destiny, path) {
        if (
            isFunction(value) &&
            value._name == dop.cons.REMOTE_FUNCTION_UNSETUP
        ) {
            dop.set(source, prop, value(node, object_owner_id, path.slice(0)))
        }
    })
}
