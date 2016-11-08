
dop.util.path = function (source, callback, destiny, mutator) {

    var hasCallback = typeof callback == 'function',
        hasDestiny = dop.util.isObject(destiny);

    dop.util.pathRecursive(
        source, 
        destiny, 
        callback, 
        [], 
        [],
        hasCallback,
        hasDestiny,
        mutator
   );

    return destiny;
};

dop.util.pathRecursive = function (source, destiny, callback, circular, path, hasCallback, hasDestiny, mutator) {

    var prop, value, typeofValue, skip;

    for (prop in source) {

        skip = false;
        value = source[prop];

        if (hasCallback) {
            // path.push(prop);
            // skip = callback(source, prop, value, destiny, path.slice(0), this);
            skip = callback(source, prop, value, destiny, this);
        }

        if (skip !== true) {

            typeofValue = dop.util.typeof(value);

            if (hasDestiny)
                mutator(destiny, prop, value, typeofValue);

            // Objects or arrays
            if ((typeofValue=='object' || typeofValue=='array') && value!==source && circular.indexOf(value)==-1) {
                circular.push(value);
                dop.util.pathRecursive(value, destiny[prop], callback, circular, path, hasCallback, hasDestiny, mutator);
            }


            // if (hasCallback)
                // path.pop();
        }
    }
};