

syncio.server = function( options ) {

    if (typeof options == 'undefined')
        options = {};

    if (typeof options.adapter != 'function')
        options.adapter = syncio.SockJS;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + syncio.name;


    var on = {

        open: function(user){
            $this.users[ user.id ] = user;
            $this.emit( syncio.on.open, user);
        },

        message: function(user, message){

            message_json = undefined;

            if (typeof message == 'string') {
                try { message_json = JSON.parse( message ); } 
                catch(e) {}
            }
            else 
                message_json = message;

            $this.emit( syncio.on.message, user, message, message_json );
        },

        close: function(user){
            $this.emit( syncio.on.close, user );
            delete $this.users[ user.id ];
        }

    },

    message_json,

    $this = new EventEmitter;

    $this.apps = {};

    $this.appsid = {};

    $this.users = {};

    $this.adapter = $this[options.adapter.name_adapter] = options.adapter( options, on );

    $this._app_inc = 0;

    $this.app = syncio.app.bind( $this );


    // // Broadcast data to all users
    // $this.send = function( data ) {
    //     for (var id in $this.users)
    //         $this.users[id].$send( data );
    // };


    return $this;

};
