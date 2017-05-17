
dop.core.encodeFunction = function(property, value) {
    return (isFunction(value) && !dop.isBroadcastFunction(value)) ? 
        dop.protocol.instructionsPatchs.function
    : 
        dop.core.encode(property, value);
};