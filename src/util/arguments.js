
// This method find arguments from inside to outside, and if the callback return true will stop
syncio.arguments = function( args, callback ) {

    var finder = args;

    while ( typeof finder.callee.caller == 'function' ) {

        if ( callback( finder.callee.caller.arguments ) )
            return args[0];

        else
            finder = finder.callee.caller.arguments;

    }

    return args[0];
    
};
