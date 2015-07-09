

syncio.promise = function( request ) {

    var
    canceled = false,
    deferred = {},
    promise = new Promise(function(resolve, reject) {
        deferred.resolve = function() {
            if (!canceled)
                return resolve.apply(promise, arguments);
        };
        deferred.reject = function() {
            if (!canceled)
                return reject.apply(promise, arguments);
        };
    });
    promise.deferred = deferred;

    if (typeof request == 'function') {

        var cancel_fun = request.call(promise, deferred.resolve, deferred.reject);

        if (typeof cancel_fun == 'function') {
            promise.cancel = function() {
                canceled = true;
                cancel_fun.apply(promise, arguments);
            };
        }

    }

    return promise;

};







// var mypromise = syncio.promise(function(resolve, reject){

//     var id = setTimeout(function(){
//         resolve(123);
//     },1000);

//     return function cancel(){
//         // clearTimeout(id);
//     };

// });


// mypromise
// .then(function(x){
//     return x+1;
// })
// .then(function(x){
//     return syncio.promise(function(resolve){ 
//         setTimeout(function(){ 
//             resolve(x+1);
//         },2000);
//     });
// })
// .then(function(x){
//     console.log( x );
// })

// // This is how we can cancel the promise before is resolved
// setTimeout(function(){
//     // mypromise.cancel();
// },500);

