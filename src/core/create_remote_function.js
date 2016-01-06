
// Create a remote function
syncio.create_remote_function = function ( path ) {

    var that = this;
    return function $syncio_remote_function() {

        return that.call( path, Array.prototype.slice.call( arguments ) );

    };

    // // http://jsperf.com/dynamic-name-of-functions
    // return new Function(
    //     "return function " + syncio.name_remote_function + "(){  return that.call( path, arguments ); }"
    // )();

};