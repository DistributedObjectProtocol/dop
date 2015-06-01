

syncio.server = function( options ) {

    if (typeof options == 'undefined')
        options = {};

    if (typeof options.adapter != 'function')
        options.adapter = syncio.SockJS;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + syncio.name;


    var on = {

        open: function( user ){

            // Setup new user
            var token = (Math.random() * Math.pow(10,18));
            user[syncio.user_token_key] = token; // http://jsperf.com/token-generator
            user[syncio.user_server_key] = $this;

            // Setup server for new user
            $this.users[ token ] = user;
            $this.emit( syncio.on.open, user );

            // Sending token to the user
            user.send( JSON.stringify( syncio.request.call($this, syncio.protocol.connect, token) ) );
            // For broadcast
            // request = syncio.request.call($this, syncio.protocol.connect, token);
            // $this.requests[ request[0] ].total += 1;

        },

        message: function(user, message){

            var message_json = undefined;

            if (typeof message == 'string') {
                try { message_json = syncio.parse( message ); } 
                catch(e) {}
            }
            else 
                message_json = message;

            $this.emit( syncio.on.message, user, message_json, message );
        },

        close: function(user){
            $this.emit( syncio.on.close, user );
            delete $this.users[ user[syncio.user_token_key] ];
        }

    },


    $this = new EventEmitter;

    $this.request_id = 1;

    $this.requests = {};

    $this.responses = {};

    $this.objects = {};

    $this.users = {};

    $this._object_inc = 0;

    $this.adapter = $this[options.adapter.name_adapter] = options.adapter( options, on );


    return $this;

};
