
dop.core.proxyArrayCaller = function(method, array, args) {
    dop.data.collectingSystem = true;
    var result = Array.prototype[method].apply(array, args);
    dop.data.collectingSystem = false;
    dop.core.emitMutations(dop.getObjectId(array));
    return result;
};