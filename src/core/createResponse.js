
dop.core.createResponse = function() {
    arguments[0] = arguments[0]*-1;
    return Array.prototype.slice.call(arguments, 0);
};