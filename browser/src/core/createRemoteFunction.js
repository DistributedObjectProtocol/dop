
// Create a remote function
synko.createRemoteFunction = function ( path ) {

    var that = this;
    return function $SYNKO_REMOTE_FUNCTION() {

        return that.call( path, Array.prototype.slice.call( arguments ) );

    };

    // // http://jsperf.com/dynamic-name-of-functions
    // return new Function(
    //     "return function " + synko.name_remote_function + "(){  return that.call( path, arguments ); }"
    // )();

};