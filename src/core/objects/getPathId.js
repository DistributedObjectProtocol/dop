
dop.core.getPathId = function(path) {

    var index = 0,
        total = path.length,
        path_id = '';

    for (; index<total; ++index)
        path_id += dop.core.pathSeparator(path[index]);

    return path_id;
};