
dop.core.createAsync = function(node, request_id) {
    var async = {};
    async.stream = new Promise(function(resolve, reject){
        async.resolve = resolve;
        async.reject = reject;
    });
    return async;
};



// mypromise = dop.createAsync();
// mypromise.then(function(v){
//     console.log('yeah',v)
// });
// setTimeout(function(){
//     mypromise.resolve(1234567890)
// },1000);


// dop.createAsync = function() {
//     var observable = Rx.Observable.create(function(observer) {
//         observable.resolve = function(value){
//             observer.onNext(value);
//             observer.onCompleted();
//         };
//         observable.reject = observer.onError;
//     });
//     return observable;
//     // return {stream:observable,resolve:observer.onNext,reject:observer.onError,cancel:cancel};
// };
// mypromise = dop.createAsync();
// mypromise.subscribe(function(v){
//     console.log('yeah',v);
// });
// setTimeout(function(){
//     mypromise.resolve(1234567890);
// },1000);
