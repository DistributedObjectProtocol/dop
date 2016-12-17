
dop.core.objectIsStillStoredOnPath = function(object) {

    var path = dop.getObjectDop(object),
        index = path.length-1,
        parent;

    for (;index>0; --index) {
        // parent = (index>1) ? dop.getObjectDop(object)._ : dop.data.object[path[0]];
        if (index>1) {
            parent = dop.getObjectParent(object);
            if (parent[path[index]] !== object)
                return false;
            object = dop.getObjectProxy(parent);
        }
        // else
            // return false;
    }

    return true;
};