
dop.isBroadcastFunction = function(fun) {
    return (isFunction(fun) && fun.name===dop.cons.BROADCAST_FUNCTION);
};