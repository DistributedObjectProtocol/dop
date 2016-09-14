
dop.onsubscribe = function( callback ) {
    dop.util.invariant(typeof callback == 'function', 'dop.onsubscribe only accept a function as parameter' );
    dop.data.onsubscribe = callback;
};