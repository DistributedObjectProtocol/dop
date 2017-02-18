
dop.core.setPatchFunction = function(object, patch) {
    dop.util.path({a:patch}, null, {a:object}, function(destiny, prop, value, typeofValue, path){
        if (isFunction(value) && value.name==dop.core.createRemoteFunction.name)
            dop.set(destiny, prop, value(dop.getObjectDop(object)[0], path.slice(1)));
        else
            return dop.core.setPatchMutator(destiny, prop, value, typeofValue, path);
    });
    return object;
};