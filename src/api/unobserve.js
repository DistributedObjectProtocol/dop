
dop.unobserve = function(object, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.unobserve needs a registered object as first parameter');
    dop.util.invariant(typeof callback == 'function', 'dop.unobserve needs a callback as second parameter');

    var observers = object[dop.specialprop.dop].o, indexOf;
    if ( dop.util.typeof(observers) != 'array' )
        return false;

    indexOf = observers.indexOf(callback);

    if (indexOf == -1)
        return false;
    else
        observers.splice(indexOf, 1);

    if (observers.length == 0)
        delete object[dop.specialprop.dop].o;

    return true;
};