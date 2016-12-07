
dop.observeProperty = function(object, property, callback) {
    dop.util.invariant(dop.isRegistered(object), 'dop.observeProperty needs a registered object as first parameter');
    dop.util.invariant(isFunction(callback), 'dop.observeProperty needs a callback as third parameter');

    if (dop.util.typeof(dop.getObjectDop(object).op) != 'object')
        dop.getObjectDop(object).op = {};

    var observers = (dop.util.typeof(dop.getObjectDop(object).op[property]) != 'array') ?
        (dop.getObjectDop(object).op[property] = [])
    :
        dop.getObjectDop(object).op[property];


    if (observers.indexOf(callback) == -1) {
        observers.push(callback);
        return function defered() {
            return dop.unobserveProperty(object, property, callback);
        }
    }
};