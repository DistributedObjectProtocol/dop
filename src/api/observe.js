
dop.observe = function(object, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.observe needs a registered object as first parameter');
    dop.util.invariant(typeof callback == 'function', 'dop.observe needs a callback as second parameter');

    if ( dop.util.typeof(dop.getObjectDop(object).o) != 'array' )
        dop.getObjectDop(object).o = [];

    if (dop.getObjectDop(object).o.indexOf(callback) == -1) {
        dop.getObjectDop(object).o.push(callback);

        return function defered() {
            return dop.unobserve(object, callback);
        }
    }

};