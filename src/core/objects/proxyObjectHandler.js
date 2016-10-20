
dop.core.proxyObjectHandler = {
    set: function(object, property, value) {
        return dop.core.set(object, property, value) !== undefined;
    },
    deleteProperty: function(object, property) {
        return dop.core.delete(object, property) !== undefined;
    },
    /*get: function(object, property) {
        dop.data.lastGet.object = object;
        dop.data.lastGet.property = property;
        return object[property];
    }*/
};
