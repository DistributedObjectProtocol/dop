
dop.collectFirst = function(filter) {
    dop.util.invariant(arguments.length===0 || (arguments.length>0 && typeof filter=='function'), 'dop.collectFirst only accept one argument as function');
    return dop.core.createCollector(dop.data.collectors[0], 0, filter);
};