
// Create a remote function
syncio.create_remote_function = function ( path ) {

    var that = this;
    // return function key_remote_function() {

    //     return that.call( path, arguments );

    // };
	
	// http://jsperf.com/dynamic-name-of-functions
    return new Function(
        "return function " + syncio.key_remote_function + "(){  return that.call( path, arguments ); }"
    )();

};