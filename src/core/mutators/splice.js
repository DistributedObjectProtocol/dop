dop.core.splice = function(array, args) {
    var object_target = dop.getObjectTarget(array),
        object_proxy = dop.getObjectProxy(array),
        original_length = object_target.length,
        spliced,
        path

    // Splicing!!
    spliced = Array.prototype.splice.apply(object_target, args)

    // If enviroment do not allow proxies (object_target and object_proxy are same object in that case)
    // or if the array is the proxy itself
    path = dop.getObjectPath(array)
    if (path) {
        var argslength = args.length,
            length = object_target.length,
            index = 2,
            start = Number(args[0]),
            // delete_count = (Number(args[1])>0) ? args[1] : 0,
            itemslength = args.length > 2 ? args.length - 2 : 0,
            item

        // Defaults for start
        if (isNaN(start)) start = 0
        else if (start < 0) start = length + start < 0 ? 0 : length + start
        else if (start > original_length) start = original_length

        // // We dont need update becase no items remaining after splice
        // end = (argslength===1) ? 0 :
        //     // If delete_count is the same of items to add means the new lengh is the same and we only need to update the new elements
        //     (argslength>2 && delete_count===itemslength) ?
        //         start+delete_count
        //     :
        //         object_target.length;

        // We must register new objects
        for (; index < argslength; ++index, ++start) {
            item = args[index]
            if (dop.isPojoObject(item))
                object_target[start] = dop.core.configureObject(
                    item,
                    start,
                    object_proxy
                )
        }

        // Storing mutation
        if (
            (object_target === object_proxy || array === object_proxy) &&
            (original_length !== length || itemslength > 0)
        ) {
            if (args[0] < 0) args[0] = array.length + args[0]
            var mutation = {
                object: object_proxy,
                prop: dop.getObjectProperty(array),
                path: path,
                splice: args
            }

            if (spliced.length > 0) mutation.spliced = dop.util.clone(spliced)

            if (length !== original_length)
                mutation.old_length = original_length

            dop.core.storeMutation(mutation)
        }
    }

    return spliced
}
