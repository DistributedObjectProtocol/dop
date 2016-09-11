
dop.getObjectRoot = function( object ) {
    while( object[dop.specialkey.object_path].length > 1 )
        object = object[dop.specialkey.object_path].p;
    return object;
};