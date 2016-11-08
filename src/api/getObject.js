
dop.getObjectDop = function(object) {
    return object[CONS.dop];
};

dop.getObjectId = function(object) {
    return dop.getObjectDop(object)[0];
};

dop.getObjectProperty = function(object) {
    var object_dop = dop.getObjectDop(object);
    return object_dop[object_dop.length-1];
};

dop.getObjectProxy = function(object) {
    return dop.getObjectDop(object).p;
};

dop.getObjectRoot = function(object) {
    return dop.data.object[dop.getObjectId(object)];
};

dop.getObjectRootById = function(object_id) {
    return dop.data.object[object_id];
};

dop.getObjectTarget = function(object) {
    return dop.getObjectDop(object).t;
};