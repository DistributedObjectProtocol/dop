
// Create a remote function
synko.create_remote_function = function ( path ) {

    var that = this;
    return function $synko_remote_function() {

        return that.call( path, Array.prototype.slice.call( arguments ) );

    };

    // // http://jsperf.com/dynamic-name-of-functions
    // return new Function(
    //     "return function " + synko.name_remote_function + "(){  return that.call( path, arguments ); }"
    // )();

};