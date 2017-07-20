
dop.core.createCollector = function(queue, index) {
    var collector = new dop.core.collector(queue, index);
    return collector;
};