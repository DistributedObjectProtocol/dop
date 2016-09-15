
dop.observeProperty = function(object, property, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.observeProperty needs a registered object as first parameter');
    dop.util.invariant(typeof callback == 'function', 'dop.observeProperty needs a callback as third parameter');

    if ( dop.util.typeof(object[dop.specialprop.dop].op) != 'object' )
        object[dop.specialprop.dop].op = {};

    var observers = ( dop.util.typeof(object[dop.specialprop.dop].op[property]) != 'array' ) ?
        (object[dop.specialprop.dop].op[property] = [])
    :
        object[dop.specialprop.dop].op[property];


    if (observers.indexOf(callback) == -1) {
        observers.push(callback);
        return function defered() {
            return dop.unobserveProperty(object, property, callback);
        }
    }
};