

syncio.api.prototype.set = function( object, key, value ) {

    // If writable

    
    if ( syncio.util.typeof( object[syncio.key_object_path] ) != 'array' ) {
        // error
    }

    var old_value = object[key],
        path = object[syncio.key_object_path].slice(0),
        data = [ syncio.protocol.set, path, old_value ];
        path.push( key );
    

    if ( arguments.length == 3)
        data.push( value );

    var request = syncio.request.call( this, data );
    this.send( syncio.stringify.call(this, request.data ) );

    return request.promise;

};












