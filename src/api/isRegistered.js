
dop.isRegistered = function (object) {
    return (isObject(object) && dop.getObjectDop(object) !== undefined);
};