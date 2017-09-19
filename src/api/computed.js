
dop.computed = function(callback) {
    dop.util.invariant(isFunction(callback), 'dop.computed needs a function as first parameter');
    var f = function (object, property, shallWeSet, oldValue) {
        return dop.core.createComputed(object, property, callback, shallWeSet, oldValue);
    }
    f._name = dop.cons.COMPUTED_FUNCTION;
    return f;
};