
dop.dispatch = function() {
    dop.data.collecting = false;
    return dop.core.emitMutations();
};