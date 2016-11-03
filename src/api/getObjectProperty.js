
dop.getObjectProperty = function(object) {
    var object_dop = dop.getObjectDop(object);
    return object_dop[object_dop.length-1];
};