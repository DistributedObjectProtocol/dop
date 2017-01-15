
dop.core.proxyObjectHandler = {
    set: function(object, property, value) {
        dop.core.set(dop.getObjectProxy(object), property, value);
        return true;
    },
    deleteProperty: function(object, property) {
        return dop.core.delete(dop.getObjectProxy(object), property) !== undefined;
    },
    /*get: function(object, property) {
        dop.data.lastGet.object = object;
        dop.data.lastGet.property = property;
        return object[property];
    }*/
};
