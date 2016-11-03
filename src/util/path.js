
dop.util.path = function (source, callback, destiny, mutate) {

    var hasCallback = typeof callback == 'function',
        hasDestiny = dop.util.isObject(destiny);

    pathRecursive(
        source, 
        destiny, 
        callback, 
        [], 
        [],
        hasCallback,
        hasDestiny,
        hasDestiny && mutate === true
   );

    return destiny;
};

function pathRecursive(source, destiny, callback, circular, path, hasCallback, hasDestiny, mutate) {

    var prop, value, value2, isArray, skip;

    for (prop in source) {

        skip = false;
        value = source[prop];

        if (hasCallback) {
            // path.push(prop);
            // skip = callback(source, prop, value, destiny, path.slice(0), this);
            skip = callback(source, prop, value, destiny, this);
        }

        if (skip !== true) {

            // Objects or arrays
            if (value && value !== source && (value.constructor === Object || (isArray=Array.isArray(value))) && circular.indexOf(value)==-1) {

                circular.push(value);

                if (hasDestiny) {
                    value2 = (!destiny.hasOwnProperty(prop)) ?
                        (destiny[prop] = (isArray) ? [] : {})
                    :
                        destiny[prop];
                }

                pathRecursive(value, value2, callback, circular, path, hasCallback, hasDestiny, mutate);

            }
            else if (mutate) {
                if (value === undefined)
                    delete destiny[prop];
                else
                    destiny[prop] = value;
            }


            // if (hasCallback)
            //     path.pop();
        }
    }

}