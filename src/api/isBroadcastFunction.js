dop.isBroadcastFunction = function(fun) {
    return isFunction(fun) && fun._name === dop.cons.BROADCAST_FUNCTION
}
