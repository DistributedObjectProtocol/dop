
dop.core.proxyObjectHandler = {
    set: function(object, property, value) {
        dop.core.set(dop.getObjectProxy(object), property, value);
        return true;
    },
    deleteProperty: function(object, property) {
        return dop.core.delete(dop.getObjectProxy(object), property) !== undefined;
    },
    get: function(object, property) {
        if (dop.data.gets_collecting && typeof property == 'string' && property !== dop.cons.DOP && object[property] !== Object.prototype[property])
            dop.data.gets_paths.push(dop.getObjectPath(object, false).concat(property));

        return object[property];
    }
};
            /*var gets_paths = dop.data.gets_paths,
                last_path = gets_paths[gets_paths.length-1],
                path = dop.getObjectPath(object).concat(property);

            if (gets_paths.length>0 && path.length>last_path.length)
                gets_paths.pop();
            
            gets_paths.push(path);*/
