
dop.core.splice = function(array, args) {

    var objectTarget = dop.getObjectTarget(array),
        objectProxy = dop.getObjectProxy(array),
        originalLength = objectTarget.length,
        spliced,
        path;

    // Splicing!!
    spliced = Array.prototype.splice.apply(objectTarget, args);

    // If enviroment do not allow proxies (objectTarget and objectProxy are same object in that case) 
    // or if the array is the proxy itself
    path = dop.getObjectPath(array)
    if (path) {

        var argslength = args.length,
            length = objectTarget.length,
            index=2,
            start = Number(args[0]),
            // deleteCount = (Number(args[1])>0) ? args[1] : 0,
            itemslength = (args.length>2) ? (args.length-2) : 0,
            item;


        // Defaults for start
        if (isNaN(start))
            start = 0;
        else if (start<0)
            start = (length+start < 0) ? 0 : length+start;
        else if (start>originalLength)
            start = originalLength;


        // // We dont need update becase no items remaining after splice
        // end = (argslength===1) ? 0 :
        //     // If deleteCount is the same of items to add means the new lengh is the same and we only need to update the new elements
        //     (argslength>2 && deleteCount===itemslength) ?
        //         start+deleteCount
        //     :
        //         objectTarget.length;


        // We must register new objects
        for (;index<argslength; ++index, ++start) {
            item = args[index];
            if (dop.isObjectRegistrable(item))
                objectTarget[start] = dop.core.configureObject(
                    item,
                    start,
                    objectProxy
                );
        }

        // Storing mutation
        if ((objectTarget===objectProxy || array===objectProxy) && (originalLength!==length || itemslength>0)) {
            if (args[0]<0)
                args[0] = array.length+args[0];
            var mutation = {
                object: objectProxy,
                prop: dop.getObjectProperty(array),
                path: path,
                splice: args
            };

            if (spliced.length > 0)
                mutation.spliced = dop.util.clone(spliced);

            if (length !== originalLength)
                mutation.oldLength = originalLength;

            dop.core.storeMutation(mutation);
        }

    }

    return spliced;
};