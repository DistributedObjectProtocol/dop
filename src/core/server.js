

syncio.server = function( adapter, options ) {

    if (typeof options == 'undefined')
        options = {};

    if (typeof options.url != 'string')
        options.url = '/' + syncio.name;

    var $this = new EventEmitter,

    on = {

        open: function(user){ 
            $this.emit( syncio.on.open, user);
        },

        message: function(user, message){ 
            $this.emit( syncio.on.message, user, message );
        },

        close: function(user){ 
            $this.emit( syncio.on.close, user );
        }

    };

    $this.adapter = adapter( options, on );

    return $this;

};