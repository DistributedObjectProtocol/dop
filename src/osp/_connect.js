

syncio.osp._connect = function ( sender, request, response ) {

    this.emit( syncio.on.connect, sender, request, response );

};