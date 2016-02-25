

dop.api.prototype.set = function( object, key, value ) {

    // If writable

    
    if ( dop.util.typeof( object[dop.key_object_path] ) != 'array' ) {
        // error
    }

    var old_value = object[key],
        path = object[dop.key_object_path].slice(0),
        data = [ dop.protocol.set, path, old_value ];
        path.push( key );
    

    if ( arguments.length == 3)
        data.push( value );

    var request = dop.request.call( this, data );
    this.send( dop.stringify.call(this, request.data ) );

    return request.promise;

};












