
dop.isRegistered = function (object) {
    return (dop.util.isObject(object) && dop.getObjectDop(object) !== undefined);
};