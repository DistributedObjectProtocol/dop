

synko.SockJS = function( options, on ) {

    var socket = new synko.SockJS.api( options.url, undefined, options );

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

synko.SockJS.name_connector = 'SockJS';
synko.SockJS.api = window.SockJS;



// SockJS.prototype.reconnect = function() {

//     if (this.readyState != 1)

//         SockJS.call(this, this._base_url, this._options );

// };