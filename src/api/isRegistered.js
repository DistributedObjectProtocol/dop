
dop.isRegistered = function (object) {
    return (dop.isObject(object) && dop.getObjectDop(object) !== undefined);
};