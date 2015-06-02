

syncio.create = function( options ) {

    if (typeof options == 'undefined')
        options = {};

    if (typeof options.adapter != 'function')
        options.adapter = syncio.SockJS;

    if (typeof options.namespace != 'string')
        options.namespace = '/' + syncio.name;


    var on = {

        open: syncio.onopen.bind(this),

        message: syncio.onmessage.bind(this),

        close: syncio.onclose.bind(this)

    };


    this.request_id = 1;

    this.requests = {};

    this.responses = {};

    this.objects = {};

    this.users = {};

    this._object_inc = 0;

    this.adapter = this[options.adapter.name_adapter] = options.adapter( options, on );


};


syncio.create.prototype = Object.create( EventEmitter.prototype );

