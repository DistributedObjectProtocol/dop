
dop.getObjectRoot = function( object ) {
    while( object[dop.specialprop.dop].length > 1 )
        object = object[dop.specialprop.dop].p;
    return object;
};