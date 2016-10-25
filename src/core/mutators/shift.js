
dop.core.shift = function() {
    if (this.length === 0)
        return undefined;
    var spliced = dop.core.splice.call(this, 0, 1);
    return spliced[0];
};