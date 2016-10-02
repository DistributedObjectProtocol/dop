
dop.collect = function(callback) {
    dop.util.invariant(arguments.length===0 || (arguments.length>0 && typeof callback=='function'), 'dop.collect only accept one argument as function');
    var collector = {mutations:[],callback:callback};
    collector.dispatch = dop.dispatch.bind(collector, collector.mutations);
    dop.data.collectors.push(collector);
    return collector;
};