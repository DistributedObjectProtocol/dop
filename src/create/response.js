
// Where the response of every request is sended
syncio.create.prototype.response = function ( user, response ) {

	user.send( syncio.stringify(response) );

};
