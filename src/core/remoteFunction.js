
dop.core.remoteFunction = function $DOP_REMOTE_function( property ) {

    console.log(this[dop.specialkey.object_path], property, Array.prototype.slice.call(arguments,1));

};


/*
// Create a remote function
dop.remoteFunction = function( path ) {

    var that = this;
    return function $DOP_REMOTE_function() {

        return that.call( path, Array.prototype.slice.call( arguments ) );

    };

    // // http://jsperf.com/dynamic-name-of-functions
    // return new function(
    //     "return function " + dop.name_remote_function + "(){  return that.call( path, arguments ); }"
    // )();

};
*/