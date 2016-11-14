
dop.util.path = function (source, callback, destiny, mutator) {
    var hasCallback = typeof callback == 'function',
        hasDestiny = dop.util.isObject(destiny);
    dop.util.pathRecursive(source, callback, destiny, mutator, [], [], hasCallback, hasDestiny);
    return destiny;
};

dop.util.pathRecursive = function (source, callback, destiny, mutator, circular, path, hasCallback, hasDestiny) {

    var prop, value, typeofValue, skip;

    for (prop in source) {

        skip = false;
        value = source[prop];
        path.push(prop);

        if (hasCallback)
            skip = callback(source, prop, value, destiny, path, this);

        if (skip !== true) {

            typeofValue = dop.util.typeof(value);

            if (hasDestiny)
                mutator(destiny, prop, value, typeofValue, path);

            // Objects or arrays
            if ((typeofValue=='object' || typeofValue=='array') && value!==source && circular.indexOf(value)==-1) {
                circular.push(value);
                dop.util.pathRecursive(value, callback, hasDestiny?destiny[prop]:undefined, mutator, circular, path, hasCallback, hasDestiny);
            }

            path.pop();
        }
    }
};