
dop.core.encodeFunction = function(property, value) {
    return (isFunction(value)) ? '~F' : dop.core.encode(property, value);
};