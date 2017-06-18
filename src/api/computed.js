
dop.computed = function(callback) {
    dop.util.invariant(isFunction(callback), 'dop.computed needs a function as first parameter');
    return function $DOP_COMPUTED_FUNCTION(object, property, shallWeSet, oldValue) {
        return dop.core.createComputed(object, property, callback, shallWeSet, oldValue);
    };
};