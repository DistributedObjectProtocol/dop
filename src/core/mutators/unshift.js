
dop.core.unshift = function() {
    if (arguments.length === 0)
        return this.length;
    var items = Array.prototype.slice.call(arguments, 0);
    items.unshift(0, 0);
    var spliced = dop.core.splice.apply(this, items);
    return this.length;
};