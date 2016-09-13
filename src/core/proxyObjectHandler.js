
dop.core.proxyObjectHandler = {
    set: function(object, property, value) {
        dop.set(object, property, value);
        return true;
    }
};