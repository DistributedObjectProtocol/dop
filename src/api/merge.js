
dop.merge = function() {
    var collector = dop.collect();
    dop.util.merge.apply(this, arguments);
    return collector.dispatch();
};