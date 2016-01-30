

synko.on.open = function() {

    var request = synko.request.call( this, [] );

    request.data.push( synko.protocol.connect );

    this.send( JSON.stringify( request.data ) );

};