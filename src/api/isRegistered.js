
dop.isRegistered = function (object) {
    return (dop.isObject(object) && object[dop.specialprop.dop] !== undefined);
};