
dop.core.splice = function(array, args) {

    var originallength = array.length,
        objectTarget = dop.getObjectTarget(array),
        objectProxy = dop.getObjectProxy(array),
        spliced;



    // Splicing!!
    spliced = Array.prototype.splice.apply(objectTarget, args);

    // If enviroment do not allow proxies (objectTarget and objectProxy are same object in that case) 
    // or if the array is the proxy itself
    if (objectTarget===objectProxy || array===objectProxy) {

        var argslength = args.length,
            length = objectTarget.length,
            start = Number(args[0]),
            deleteCount = (Number(args[1])>0) ? args[1] : 0,
            itemslength = (args.length>2) ? (args.length-2) : 0,
            end, item, object_dop;


        // Defaults for start
        if (isNaN(start))
            start = 0;
        else if (start<0)
            start = (length+start < 0) ? 0 : length+start;
        else if (start>originallength)
            start = originallength;


        // We dont need update becase no items remaining after splice
        end = (argslength===1) ? 0 :
            // If deleteCount is the same of items to add means the new lengh is the same and we only need to update the new elements
            (argslength>2 && deleteCount===itemslength) ?
                start+deleteCount
            :
                objectTarget.length;



        for (;start<end; ++start) {
            item = objectTarget[start];
            if (dop.util.isObjectRegistrable(item)) {

                object_dop = dop.getObjectDop(item);

                if (object_dop!==undefined && object_dop._ === objectTarget)
                    object_dop[object_dop.length-1] = start;

                else
                    objectTarget[start] = dop.core.configureObject(
                        item,
                        dop.getObjectDop(objectTarget).concat(start),
                        // dop.data.object_data[dop.getObjectId(objectTarget)].options.proxy,
                        objectTarget
                    );
            }
        }


        if (originallength!==length || itemslength>0) {
            if (args[0]<0)
                args[0] = array.length+args[0];
            var mutation = {
                object:objectProxy,
                splice:args
            };
            if (spliced.length > 0)
                mutation.spliced = spliced;
            dop.core.storeMutation(mutation);
        }

    }

    return spliced;
};
