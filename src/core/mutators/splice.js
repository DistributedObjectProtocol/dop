
dop.core.splice = function() {
    var objectTarget = dop.getObjectTarget(this),
        output = Array.prototype.splice.apply(objectTarget, arguments);
    if (output.length>0 && objectTarget !== this)
        dop.core.storeSplice(objectTarget, output, Array.prototype.slice.call(arguments, 0));
    return output;
};


dop.core.storeSplice = function(array, spliced, args) {

    var start = args[0],
        deleteCount = args[1],
        index = 0,
        total = array.length,
        tof,
        item,
        object_dop;

    for (;index<total; ++index) {
        item = array[index];
        if (dop.util.isObjectStandard(item)) {

            object_dop = dop.getObjectDop(item);

            if (object_dop!==undefined && object_dop._ === array)
                object_dop[object_dop.length-1] = index;

            else
                array[index] = dop.core.configureObject(
                    item,
                    dop.getObjectDop(array).concat(index),
                    dop.data.object_data[dop.getObjectId(array)].options.proxy,
                    array
                );
        }
    }


    dop.core.storeMutation({
        object: dop.getObjectProxy(array),
        splice: args,
        spliced: spliced
    });
};