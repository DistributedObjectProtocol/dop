
// http://socket.io/docs/server-api/
syncio.socketio = function ( options, on ) {

    options.connector = options._connector; // Need it because socketio accept the option connector as parameter natively

    var that = new syncio.socketio.api( options.httpServer, options );

    if (typeof options.httpServer == 'undefined') {

        if (typeof options.port != 'number')
            options.port = syncio.port;

        that.listen( options.port );

    }

    that.of( options.namespace ).on('connection', function( user ){

        user.emit('open');

        user.on('message', function(message){
            on.message( user, message );
        });

        user.on('disconnect', function(){
            on.close( user );
        });

        user.send = syncio.socketio.send;

        user.close = syncio.socketio.close;

        on.open( user );

    });


    return that;

};

syncio.socketio.api = require('socket.io');
syncio.socketio.name_connector = 'socketio';

syncio.socketio.send = function( data ) {
    this.emit('message', data);
};
syncio.socketio.close = function( data ) {
    this.disconnect();
};



/*

Url-Server: /syncio
Url-Client: http://localhost:9999/syncio

*/



