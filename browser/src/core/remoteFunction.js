
// Create a remote function
dop.remoteFunction = function ( path ) {

    var that = this;
    return function $DOP_REMOTE_FUNCTION() {

        return that.call( path, Array.prototype.slice.call( arguments ) );

    };

    // // http://jsperf.com/dynamic-name-of-functions
    // return new Function(
    //     "return function " + dop.name_remote_function + "(){  return that.call( path, arguments ); }"
    // )();

};