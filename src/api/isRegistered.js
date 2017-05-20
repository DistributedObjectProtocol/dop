
dop.isRegistered = function(object) {
    return (
        dop.getObjectDop(object) !== undefined &&
        !Object.getOwnPropertyDescriptor(object, dop.cons.DOP).enumerable
    );
};