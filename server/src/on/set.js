

syncio.on.set = function( user, request ) {
    
    var response = [ request[0] * -1 ],
        object_id = request[2][0],
        obj = syncio.objects[object_id].object;

    // If the object is writable by the user
    if ( user.writables[object_id] ) {

        var exists = true,
            oldValueRemote = request[3],
            oldValue = syncio.util.get(obj, request[2].slice(1), function() { 
                exists = false;
                return false; 
            });


        // console.log('exists:', exists, request, oldValue)

        // If the path exists
        if ( exists ) {
            
            var change = false;
            var newValue = request[4];
            var tof = syncio.util.typeof( oldValue );

console.log(tof, oldValue, oldValueRemote, newValue)
            if ( tof == 'object' || tof == 'array' ) { 
                console.log('object o array', 'YEAH')
            }
            else if ( tof == 'regexp' && oldValue.toString() == oldValueRemote.toString() ) {
                console.log('regexp', 'YEAH')
                change = true;
            }
            else if ( tof == 'date' && oldValue.getTime() == oldValueRemote.getTime() ) {
                console.log('date', 'YEAH')
                change = true;
            }
            else if ( tof == 'symbol' ) {
                console.log('symbols', 'cant be synced')
            }

            // console.log(tof, oldValue, newValue);

        }
        else
            response.push( syncio.error.REJECT_SET_NOT_EXISTS );
    
    }
    else
        response.push( syncio.error.REJECT_SET_NOT_WRITABLE );


    user.send( JSON.stringify( response ) );

};