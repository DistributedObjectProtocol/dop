
dop.unobserveProperty = function(object, property, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.unobserveProperty needs a registered object as first parameter');
    dop.util.invariant(typeof callback == 'function', 'dop.unobserveProperty needs a callback as second parameter');

    var observers = dop.getObjectDop(object).op, indexOf;
    if ( dop.util.typeof(observers) != 'object' || dop.util.typeof(observers[property]) != 'array' )
        return false;

    observers = observers[property];
    indexOf = observers.indexOf(callback);

    if (indexOf == -1)
        return false;
    else
        observers.splice(indexOf, 1);

    if (observers.length == 0)
        delete dop.getObjectDop(object).op[property];

    return true;
};
