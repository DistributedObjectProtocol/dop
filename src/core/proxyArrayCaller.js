
dop.core.proxyArrayCaller = function(method, array, args) {
    // dop.collect(array);
    var result = Array.prototype[method].apply(array, args);
    // dop.release(array);
    return result;
};