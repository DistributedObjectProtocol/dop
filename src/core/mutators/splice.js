
dop.core.splice = function() {

    var args = arguments,
        array = this,
        argslength = args.length,
        originallength = array.length,
        shallWeStore = true,
        shallWeUpdate = true,
        start = (typeof args[0] == 'number') ? args[0] : 0,
        deleteCount = (Number(args[1])>0) ? args[1] : 0,
        itemslength = (args.length>2) ? (args.length-2) : 0,
        objectTarget = dop.getObjectTarget(array),
        objectProxy = dop.getObjectProxy(array),
        spliced, end, item, object_dop;


    // If only one argument or no splice items no mutation will happen
    if (args.length===0 || (args.length===2 && deleteCount===0))
        return [];

    // Splicing!!
    spliced = Array.prototype.splice.apply(objectTarget, args);


    // If enviroment do not allow proxies (objectTarget and objectProxy are same object in that case) 
    // or if the array is the proxy itself
    if (objectTarget===objectProxy || array===objectProxy) {

        // We dont need update becase no items remaining after splice
        if (args.length===1)
            shallWeUpdate = false;

        // Defaults for start
        if (start<0)
            start = (array.length+start)-itemslength;
        else if (start>originallength)
            start = originallength;

        // If deleteCount is the same of items to add means the new lengh is the same and we only need to update the new elements
        end = (args.length>2 && deleteCount===itemslength) ?
            start+deleteCount
        :
            objectTarget.length;


        if (shallWeUpdate) {

            for (;start<end; ++start) {
                item = array[start];
                if (dop.util.isObjectPlain(item)) {

                    object_dop = dop.getObjectDop(item);

                    if (object_dop!==undefined && object_dop._ === array)
                        object_dop[object_dop.length-1] = start;

                    else
                        array[start] = dop.core.configureObject(
                            item,
                            dop.getObjectDop(array).concat(start),
                            dop.data.object_data[dop.getObjectId(array)].options.proxy,
                            array
                        );
                }
            }
        }


        if (shallWeStore)
            dop.core.storeMutation({
                object: objectProxy,
                splice: args,
                spliced: spliced
            });

    }

    return spliced;
};
