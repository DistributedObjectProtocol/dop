
dop.core.updatePathArray = function (array, index) {
    var item = array[index];
    if (dop.isRegistered(item)) {
        var object_dop = dop.getObjectDop(item);
        if (object_dop[object_dop.length-1] !== index) {
            object_dop[object_dop.length-1] = index;
            return true;
        }
    }
    return false;
};