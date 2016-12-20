
dop.getObjectDop = function(object) {
    return object[dop.cons.DOP];
};

dop.getObjectId = function(object) {
    var object_dop = dop.getObjectDop(object);
    return object_dop ? object_dop[0] : undefined;
};

dop.getObjectParent = function(object) {
    var object_dop = dop.getObjectDop(object);
    return object_dop ? object_dop._ : undefined;
};

dop.getObjectProperty = function(object) {
    var object_dop = dop.getObjectDop(object);
    return object_dop[object_dop.length-1];
};

dop.getObjectProxy = function(object) {
    return dop.getObjectDop(object).p;
};

dop.getObjectRoot = function(object) {
    while(dop.getObjectParent(object) !== undefined)
        object = dop.getObjectParent(object);
    return dop.getObjectProxy(object);
};

// dop.getObjectRoot = function(object) {
//     return dop.data.object[dop.getObjectId(object)];
// };

// dop.getObjectRootById = function(object_id) {
//     return dop.data.object[object_id];
// };

dop.getObjectTarget = function(object) {
    return dop.getObjectDop(object).t;
};