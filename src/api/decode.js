
dop.decode = function(data) {
    return JSON.parse(data, dop.core.decode);
};