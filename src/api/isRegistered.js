
dop.isRegistered = function (object) {
    if (isObject(object)){
        var object_dop = dop.getObjectDop(object);
        if (isArray(object_dop) && object_dop.hasOwnProperty('p'))
            return true;
    }
    return false;
};