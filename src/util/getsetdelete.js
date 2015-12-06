

syncio.get = function ( obj, path, create ) {

    // If path is not an array
    if ( syncio.typeof(path) != 'array')
        throw Error('path parameter must be an array');

    // If path does not have elements we return the object itself
    if (path.length == 0)
        return obj;

    for (var i = 0; i<path.length-1; i++) {

        if ( typeof obj[ path[i] ] == 'object' )
            obj = obj[ path[i] ];

        else if ( create === true )
            obj = obj[ path[i] ] = {};

        else
            return
    }


    if ( create === true && typeof obj[ path[i] ] != 'object' )
        obj[ path[i] ] = {};


    return obj[ path[i] ];

};


syncio.get.set = function ( obj, path, value ) {

    path = path.slice(0);
    var prop = path.pop();

    obj = syncio.get(obj, path, true);

    obj[prop] = value;

    return obj

};


syncio.get.delete = function ( obj, path ) {

    path = path.slice(0);
    var prop = path.pop();

    obj = syncio.get(obj, path);

    ( syncio.typeof(obj) == 'array' && !isNaN(prop) ) ?
        obj.splice(prop, 1)
    :
        delete obj[prop];

    return obj

};
