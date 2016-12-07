
dop.onsubscribe = function(callback) {
    dop.util.invariant(isFunction(callback), 'dop.onsubscribe only accept a function as parameter');
    dop.data.onsubscribe = callback;
};