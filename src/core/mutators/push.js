// https://jsperf.com/push-against-splice OR https://jsperf.com/push-vs-splice
dop.core.push = function() {
    if (arguments.length === 0)
        return this.length;
    var items = Array.prototype.slice.call(arguments, 0);
    items.unshift(this.length, 0);
    var spliced = dop.core.splice.apply(this, items);
    return this.length;
};