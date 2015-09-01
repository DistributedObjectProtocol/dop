

syncio.return = function( data ) {

    var args = arguments, _return;

    while ( typeof args.callee.caller == 'function' ) {

        _return = args.callee.caller.arguments[args.callee.caller.arguments.length-1];

        if ( typeof _return == 'function'/* && _return.name == syncio.name_return_function*/ ) {
            _return( data );
            return data;
        }
        else
            args = args.callee.caller.arguments;
    }

    return data;
    
};


/*
function fun( a, b ) {

    return (function() {
        // (function() {
        //     (function() {
        //         (function() {
        //             (function() {
                        return syncio.return( a+b );
        //             })();
        //         })();
        //     })();
        // })();
    })();

}


var f=function syncioreturn( result ){console.log(result);};
console.log( fun(1,2, f) );
*/


