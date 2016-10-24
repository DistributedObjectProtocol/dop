

dop.core.splice = function() {
    if (arguments.length===0)
        return [];
    var objectTarget = dop.getObjectTarget(this),
        objectProxy = dop.getObjectProxy(this),
        output = Array.prototype.splice.apply(objectTarget, arguments);
    if (objectTarget===objectProxy || this===objectProxy)
        dop.core.storeSplice(objectTarget, output, Array.prototype.slice.call(arguments, 0));
    return output;
};



dop.core.storeSplice = function(array, spliced, args) {

    var length = array.length,
        start = (typeof args[0] == 'number') ? args[0] : 0,
        deleteCount = (typeof args[1] == 'number') ? ((args[1] > length) ? length-start : args[1]) : 0,
        itemslength = (args.length>2) ? (args.length-2) : 0,
        index = start,
        total = array.length,
        item,
        object_dop,
        length=(array.length+spliced.length)-itemslength; // original length


    if (start<0)
        index = (array.length+start)-itemslength;
    else if (start>length)
        index = length;

    if (deleteCount===itemslength)
        total = index+deleteCount;

    if (args.length === 1 || (args.length === 2 && deleteCount<0))
        total = -1;


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




