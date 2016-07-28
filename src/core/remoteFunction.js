
dop.core.remoteFunction = function $DOP_REMOTE_FUNCTION(property) {

    console.log(this[dop.specialkey.object_path], property, Array.prototype.slice.call(arguments,1));

};