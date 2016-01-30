

syncio.response = function( action, params ) {

    var promise;

    return syncio.util.arguments( params, function( args ) {

        promise = args[args.length-1];

        if (promise && typeof promise == 'object' && typeof promise.resolve == 'function' && typeof promise.reject == 'function' && typeof promise.response == 'object' && promise.resolved !== true) {
            promise[action].apply( promise, params );
            promise.resolved = true;
            return true;
        }
        else
            return false;

    });

};

syncio.response.resolve = function() {

    this.response.push( Array.prototype.slice.call( arguments, 0 ) );

    this.user.send( syncio.stringify.call(this.user, this.response ) );

};

syncio.response.reject = function( error ) {

    this.response[1] = error;

    this.user.send( syncio.stringify.call(this.user, this.response ) );

};









// function fun( a, b ) {

//     return (function() {
//         return (function() {
//              return syncio.resolve( a*b );
//         })();
//     })();

// }


// var o={
//     reject: function(){},
//     response: {},
//     resolve: function syncio_resolve( result ){
//         console.log('resolved1', result);
//     }
// };
// var o2={
//     reject: function(){},
//     response: {},
//     resolve: function syncio_resolve( result ){
//         console.log('resolved2', result);
//     }
// };

// console.log(2, fun(5,5, o) );
// console.log(3, fun(5,5, o) );

