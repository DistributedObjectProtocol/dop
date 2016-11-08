
dop.util.merge = function mergeRecursive(first, second) {
    var args = arguments;
    if (args.length > 2) {
        // Remove the first 2 arguments of the arguments and add thoose arguments as merged at the begining
        Array.prototype.splice.call(args, 0, 2, mergeRecursive.call(this, first, second));
        // Recursion
        return mergeRecursive.apply(this, args);
    }
    else 
        return dop.util.path(second, this, first, dop.util.mergeMutator);
};

dop.util.mergeMutator = function(destiny, prop, value, typeofValue) {
    if (typeofValue=='object' || typeofValue=='array')
        (!destiny.hasOwnProperty(prop)) ? (destiny[prop] = (Array.isArray(value)) ? [] : {}) : destiny[prop];
    else
        destiny[prop] = value;
};