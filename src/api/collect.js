
dop.collect = function(indexFunction) {
    dop.util.invariant(arguments.length==0 || (arguments.length==1 && isFunction(indexFunction)), 'dop.collect only accept one argument as function');
    var index = indexFunction ? indexFunction(dop.data.collectors) : dop.data.collectors.length;
    return dop.core.createCollector(dop.data.collectors, index);
};