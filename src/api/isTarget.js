
dop.isTarget = function (object) {
    return (dop.isRegistered(object) && dop.getObjectTarget(object)===object);
};