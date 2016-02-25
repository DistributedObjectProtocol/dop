

dop.on.open = function() {

    var request = dop.request.call( this, [] );

    request.data.push( dop.protocol.connect );

    this.send( JSON.stringify( request.data ) );

};