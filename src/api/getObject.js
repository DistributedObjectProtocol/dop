
dop.getObjectDop = function(object) {
    if (isObject(object))
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
    return dop.getObjectDop(object).pr;
};

dop.getObjectId = function(object) {
    return dop.getObjectProperty(dop.getObjectRoot(object));
};

dop.getObjectPath = function(object) {

    var path=[], 
        prop,
        parent, 
        object_dop = object[dop.cons.DOP];

    while (object_dop._ !== undefined) {
        prop = object_dop.pr;
        parent = object_dop._;
        if (parent[prop] === object_dop.p) {
            path.unshift(prop);
            object_dop = parent[dop.cons.DOP];
        }
        else {
            if (isArray(parent)) {
                prop = parent.indexOf(object_dop.p);
                if (prop === -1)
                    return;
                else
                    object_dop.pr = prop;
                    // path.unshift(prop);
            }
            else
                return;
        }
    }
    
    path.unshift(object_dop.pr);
    return path;
}





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