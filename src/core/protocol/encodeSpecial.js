
dop.core.encodeSpecial = function(property, value) {
    return (typeof value == 'string' && value[0] == '~') ? '~'+value : value;
};