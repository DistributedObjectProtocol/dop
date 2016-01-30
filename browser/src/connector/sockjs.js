

syncio.SockJS = function( url, options, on ) {

    var socket = new SockJS( url, undefined, options );

    socket.addEventListener('open', function() {
        on.open();
    });

    socket.addEventListener('message', function( message ) {
        on.message( message.data );
    });

    socket.addEventListener('close', function() {
        on.close();
    });

    socket.addEventListener('error', function( error ) {
        on.error( error );
    });

    return socket;

};

syncio.SockJS.name_connector = 'SockJS';

if ( typeof SockJS == 'function' )
    syncio.SockJS.api = SockJS;



// SockJS.prototype.reconnect = function() {

//     if (this.readyState != 1)

//         SockJS.call(this, this._base_url, this._options );

// };