
dop.util.invariant = function(check) {
    if (!check) {
        var message = dop.util.sprintf.apply(this, Array.prototype.slice.call(arguments, 1));
        throw new Error("[dop] Invariant failed: " + message);
    }
};