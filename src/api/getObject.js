
dop.getObjectDop = function(object) {
    return object[dop.cons.DOP];
};

dop.getObjectRoot = function(object) {
    return dop.getObjectDop(object).r;
};

dop.getObjectParent = function(object) {
    return dop.getObjectDop(object)._;
};

dop.getObjectProxy = function(object) {
    return dop.getObjectDop(object).p;
};

dop.getObjectTarget = function(object) {
    return dop.getObjectDop(object).t;
};

dop.getObjectProperty = function(object) {
    var object_dop = dop.getObjectDop(object);
    if (isArray(object_dop._))
        dop.getObjectPath(object);
    return object_dop.pr;
};

dop.getObjectId = function(object) {
    return dop.getObjectProperty(dop.getObjectRoot(object));
};

dop.getObjectLevel = function(object) {
    return dop.getObjectDop(object).l;
};





// dop.getObjectId = function(object) {
//     var object_dop = dop.getObjectDop(object);
//     return object_dop ? object_dop[0] : undefined;
// };
// dop.getObjectProperty = function(object) {
//     var object_dop = dop.getObjectDop(object);
//     return object_dop[object_dop.length-1];
// };
// dop.getObjectRoot = function(object) {
//     while(dop.getObjectParent(object) !== undefined)
//         object = dop.getObjectParent(object);
//     return dop.getObjectProxy(object);
// };

// dop.getObjectRoot = function(object) {
//     return dop.data.object[dop.getObjectId(object)];
// };

// dop.getObjectRootById = function(object_id) {
//     return dop.data.object[object_id];
// };