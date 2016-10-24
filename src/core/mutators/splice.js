

dop.core.splice = function() {
    if (arguments.length===0)
        return [];
    var objectTarget = dop.getObjectTarget(this),
        output = Array.prototype.splice.apply(objectTarget, arguments);
    if (objectTarget !== this)
        dop.core.storeSplice(objectTarget, output, Array.prototype.slice.call(arguments, 0));
    return output;
};



dop.core.storeSplice = function(array, spliced, args) {

    var start = args[0],
        deleteCount = args[1],
        index,
        total,
        tof,
        item,
        object_dop,
        length=(array.length+spliced.length)-args.length-2; // original length


    if (args.length>2) {
        total = array.length;
        if (args[0]<0)
            index = (array.length+args[0])-(args.length-2);
        else if (args[0]>length)
            index = length;
        else
            index = args[0]

        if (args[1]===args.length-2) {
            total = index+args[1];
        }

    }
    else if (args.length === 1 || (args.length === 2 && args[1]<0)) {
        index=0;
        total=0;
    }
    else if (args.length === 2) {
        total = array.length;
        if (args[0]<0)
            index = array.length+args[0];
        else
            index = args[0];
    }


    if (total-index === 0)
        return;


    for (;index<total; ++index) {
        item = array[index];
        if (dop.util.isObjectPlain(item)) {

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




