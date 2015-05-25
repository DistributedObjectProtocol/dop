

syncio.app = function( app_name, data_app, data_user ) {

    var $this = new EventEmitter;

    $this.id = this._app_inc++;

    $this.name = app_name;

    $this.data_app = data_app;

    $this.data_user = data_user;

    $this.on_request = function( user, message_json ) {

    };

    this.apps[ $this.id ] = $this;

    this.appsid[ app_name ] = $this.id;

    // this.on( syncio.on.message, function( user, message, message_json ) {
    //     console.log( typeof message, typeof message_json, message, message_json );
    // });

    // this.on( syncio.on.close, function( user ) {

    // });

    

    return $this;

};