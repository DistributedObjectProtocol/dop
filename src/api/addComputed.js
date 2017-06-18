
dop.addComputed = function(object, property, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.addComputed needs a registered object as first parameter');
    dop.util.invariant(isFunction(callback), 'dop.addComputed needs a function as third parameter');
    return dop.core.createComputed(object, property, callback, true, object[property]);
};