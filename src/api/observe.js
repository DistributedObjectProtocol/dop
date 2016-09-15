
dop.observe = function(object, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.observe needs a registered object as first parameter');
    dop.util.invariant(typeof callback == 'function', 'dop.observe needs a callback as second parameter');

    if ( dop.util.typeof(object[dop.specialprop.dop].o) != 'array' )
        object[dop.specialprop.dop].o = [];

    if (object[dop.specialprop.dop].o.indexOf(callback) == -1) {
        object[dop.specialprop.dop].o.push(callback);

        return function defered() {
            return dop.unobserve(object, callback);
        }
    }

};