
dop.core.pop = function(array) {
    if (array.length === 0)
        return undefined;
    var spliced = dop.core.splice(array, [-1]);
    return spliced[0];
};