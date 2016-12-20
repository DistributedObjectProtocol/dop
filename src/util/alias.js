
function isFunction(func) {
    return typeof func == 'function';
}

function isObject(object) {
    return (object!==null && typeof object=='object');
}

function isArray(array) {
    return Array.isArray(array);
}