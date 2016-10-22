
dop.core.splice = function() {
    var objectTarget = dop.getObjectTarget(this),
        output = Array.prototype.splice.apply(objectTarget, arguments);
    if ((output.length>0 || arguments.length>2) && objectTarget !== this)
        dop.core.storeSplice(objectTarget, output, Array.prototype.slice.call(arguments, 0));
    return output;
};
