
dop.core.encodeFunction = function(property, value) {
    return (isFunction(value) && !dop.isBroadcastFunction(value)) ? '~F' : dop.core.encode(property, value);
};