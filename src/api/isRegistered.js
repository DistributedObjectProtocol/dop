dop.isRegistered = function(object) {
    return (
        isObject(object) &&
        dop.getObjectDop(object) !== undefined &&
        !Object.getOwnPropertyDescriptor(object, dop.cons.DOP).enumerable
    )
}
