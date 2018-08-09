dop.getObjectPath = function(object, strict) {
    var path = [],
        // path_id = '',
        parent,
        prop,
        object_dop = object[dop.cons.DOP]

    strict = strict !== false

    while (object_dop._ !== undefined) {
        prop = object_dop.pr
        parent = dop.getObjectTarget(object_dop._)
        if (!strict || parent[prop] === object_dop.p) {
            path.unshift(prop)
            object_dop = parent[dop.cons.DOP]
            // path_id = dop.core.pathSeparator(prop)+path_id;
        } else {
            if (isArray(parent)) {
                prop = parent.indexOf(object_dop.p)
                if (prop === -1) return
                else object_dop.pr = prop
                // path.unshift(prop);
            } else return
        }
    }

    path.unshift(object_dop.pr)
    // path.path_id = dop.core.pathSeparator(object_dop.pr)+path_id;
    return path
}

// dop.getObjectPathId = function(object) {
//     return dop.core.getPathId(dop.getObjectPath(object));
// };
