
dop.encode = function(data, encoder) {
    if (typeof encoder != 'function')
        encoder = dop.core.encode;
    return JSON.stringify(data, encoder);
};