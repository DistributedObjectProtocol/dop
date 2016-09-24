
dop.core.proxyObjectHandler = {
    set: dop.set,
    deleteProperty: dop.delete/*,
    get: function(object, property) {
        dop.data.lastGet.object = object;
        dop.data.lastGet.property = property;
        return object[property];
    }*/
};
