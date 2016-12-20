
dop.isProxy = function (object) {
    return (dop.isRegistered(object) && dop.getObjectProxy(object)===object);
};