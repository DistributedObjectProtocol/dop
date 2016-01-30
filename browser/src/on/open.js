

syncio.on.open = function() {

    var request = syncio.request.call( this, [] );

    request.data.push( syncio.protocol.connect );

    this.send( JSON.stringify( request.data ) );

};