
dop.core.proxyObjectHandler = {
    set: dop.set,
    deleteProperty: dop.del,
    /*get: function(object, property) {
        dop.data.lastGet.object = object;
        dop.data.lastGet.property = property;
        return object[property];
    }*/
};
