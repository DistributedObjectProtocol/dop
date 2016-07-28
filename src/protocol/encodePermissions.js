
dop.protocol.encodePermissions = function ( writable, extendible ) {
    
    if ( extendible === true )
        return 2;
    
    return ( writable === true ) ? 1 : 0;

};