
dop.util.clone = function(value) {
    return (dop.isObjectRegistrable(value)) ?
        dop.util.merge(isArray(value) ? [] : {}, value)
    :
        value;
};