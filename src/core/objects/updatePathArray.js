
dop.core.updatePathArray = function (array, newIndex) {
    var item = array[newIndex];
    if (dop.isRegistered(item)) {

        var object_dop = dop.getObjectDop(item),
            index = object_dop.length-1;

        if (object_dop[index] !== newIndex) {
            object_dop[index] = newIndex;

            // Updating neested objects
            dop.util.path(item, function(source, prop, value, destiny, path) {
                if (dop.util.isObject(value))
                    dop.getObjectDop(value)[index] = newIndex;
            });
        }

    }
    return false;
};