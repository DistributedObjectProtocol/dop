
dop.core.proxyArrayCaller = function(method, array, args) {
    var collector = dop.collect(),
        result = Array.prototype[method].apply(array, args);
    collector.dispatch();
    return result;
};