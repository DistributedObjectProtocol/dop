dop.util.clone = function(value) {
    return dop.isPojoObject(value)
        ? dop.util.merge(isArray(value) ? [] : {}, value)
        : value
}
