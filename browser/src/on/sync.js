

syncio.on.sync = function( user, request ) {

    // Getting info
    var object_name = request[5],
        object = request[4];



    // The function sync(object_name) it has been executed, so we resolve the syncronization
    if ( typeof this.objects_name[ object_name ] == 'object' ) {

        if ( typeof this.objects_name[ object_name ].object == 'object' )
            object = this.objects_name[ object_name ].object;

        // Resolve promise
        syncio.on.sync.resolve.call( this, request, this.objects_name[ object_name ].object );

    }

    // We have to wait until the client run sync(object_name)
    else
        this.objects_name[ object_name ] = {request: request};




    this.emit( 'sync', object_name, object, request[2], request[3]===1 );


};




syncio.on.sync.resolve = function( request, object  ) {

    var request_id = request[0] * -1,
        object_id = request[2],
        writable = request[3] === 1,
        object_remote = request[4],
        object_name = request[5],
        response;
        
    if ( object && typeof object == 'object') {
        response = syncio.stringify.call(this, [request_id, syncio.protocol.fulfilled, object] );
        // if (writable) {
            // response.push
        response = response.replace(/,\s*(({\s*}\s*])|(\[\s*\]\s*]))$/, ']'); // In case the object is empty
        object = syncio.util.merge( object, object_remote );
    }
    else {
        object = object_remote;
        response = syncio.stringify.call(this, [request_id, syncio.protocol.fulfilled] );
    }



    // Configure object, adding ~PATH and observe
    syncio.configure.call(
        this,
        object, 
        [object_id], 
        writable
    );

    this.objects[ object_id ] = {object: object, name: object_name, writable: writable};

    this.objects_name[ object_name ].object = object;

    this.objects_name[ object_name ].promise.resolve( object, object_id, writable );

    this.send( response );

};


/*

sync() NO 
 * crea promesa
 * guarda objeto

 sync() SI
 * crea promesa
 * merge con objeto pasado
 * configura objeto
 * save this.objects_id
 * resuelve promesa
 * response



 onsync() NO
 * guarda request
 * emit

 onsync() SI
 * merge con objeto pasado
 * configura objeto
 * save this.objects_id
 * resuelve promesa
 * emit
 * response





*/

