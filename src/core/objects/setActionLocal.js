
dop.core.setActionLocal = function(object, action) {
    dop.util.path({a:action}, null, {a:object}, dop.core.setActionMutator);
    return object;
};