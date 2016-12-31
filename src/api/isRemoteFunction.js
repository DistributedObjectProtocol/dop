
dop.isRemoteFunction = function(fun) {
    return (isFunction(fun) && fun.name===dop.cons.REMOTE_FUNCTION);
};