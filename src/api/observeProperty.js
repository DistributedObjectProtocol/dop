
dop.observeProperty = function(object, property, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.observeProperty needs a registered object as first parameter');
    dop.util.invariant(isFunction(callback), 'dop.observeProperty needs a callback as third parameter');

    var observer = dop.createObserver(callback);
    observer.observeProperty(object, property);
    return observer;
};