
dop.createAsync = function() {
    var resolve, reject,
    promise = new Promise(function(res, rej){
        resolve = res;
        reject = rej;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};



// mypromise = dop.createAsync();
// mypromise.then(function(v){
//     console.log('yeah',v)
// });
// setTimeout(function(){
//     mypromise.resolve(1234567890)
// },1000);



// dop.createObserver = function() {
//     var observable = Rx.Observable.create(function(observer) {
//         observable.resolve = function(value){
//             observer.onNext(value);
//             observer.onCompleted();
//         };
//         observable.reject = observer.onError;
//     });
//     return observable;
// };
// mypromise = dop.createObserver();
// mypromise.subscribe(function(v){
//     console.log('yeah',v);
// });
// setTimeout(function(){
//     mypromise.resolve(1234567890);
// },1000);
