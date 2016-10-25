
dop.core.pop = function() {
    if (this.length === 0)
        return undefined;
    var spliced = dop.core.splice.call(this, -1);
    return spliced[0];
};