
dop.collect = function(filter) {
    dop.util.invariant(arguments.length===0 || (arguments.length>0 && isFunction(filter)), 'dop.collect only accept one argument as function');
    return dop.core.createCollector(dop.data.collectors, dop.data.collectors.length, filter);
};