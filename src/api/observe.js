
dop.observe = function(object, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.observe needs a registered object as first parameter');
    dop.util.invariant(isFunction(callback), 'dop.observe needs a callback as second parameter');

    var observer = dop.createObserver(callback);
    observer.observe(object);
    return observer;
};