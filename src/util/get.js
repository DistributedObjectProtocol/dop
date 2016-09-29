
dop.util.get = function( object, path ) {

    if ( path.length == 0 )
        return object;

    for (var index=0, total=path.length; index<total; index++) {

        if ( index+1<total && object[ path[index] ] !== null && dop.util.isObject(object[ path[index] ]) )
            object = object[ path[index] ];

        else if ( object.hasOwnProperty(path[index]) )
            return object[ path[index] ];

        else
            return undefined;

    }

    return object[ path[index] ];

};
