

syncio.return = function( data ) {
    var _return = arguments.callee.caller.arguments[arguments.callee.caller.arguments.length-1];
    return (typeof _return == 'function') ? _return( data ) : data;
};