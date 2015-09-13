

syncio.api.prototype.call = function ( path, args ) {

	console.log(this, path, args)

	args = Array.prototype.slice.call( args );
	var promise = new syncio.promise();
	return promise;


};