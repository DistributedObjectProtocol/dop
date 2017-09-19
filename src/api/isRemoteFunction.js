
dop.isRemoteFunction = function(fun) {
    return (isFunction(fun) && fun._name===dop.cons.REMOTE_FUNCTION);
};