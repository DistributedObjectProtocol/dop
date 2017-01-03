
dop.createAsync = function() {
    var resolve, reject,
    promise = new Promise(function(res, rej) {
        resolve = res;
        reject = rej;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};



// mypromise = dop.createAsync();
// mypromise.then(function(v) {
//     console.log('yeah',v)
// });
// setTimeout(function() {
//     mypromise.resolve(1234567890)
// },1000);


// dop.core.createAsync = function() {
//     var observable = Rx.Observable.create(function(observer) {
//         observable.resolve = function(value) {
//             observer.onNext(value);
//             observer.onCompleted();
//         };
//         observable.reject = observer.onError;
//     });
//     return observable;
//     // return {stream:observable,resolve:observer.onNext,reject:observer.onError,cancel:cancel};
// };
// mypromise = dop.createAsync();
// mypromise.subscribe(function(v) {
//     console.log('yeah',v);
// });
// setTimeout(function() {
//     mypromise.resolve(1234567890);
// },1000);




// https://github.com/ReactiveX/rxjs/issues/556
// function getData(num) {
//   return new Promise((resolve, reject) => {
//     resolve(num + 1);
//   });
// }

// async function create() {
//   var list = await Rx.Observable.range(1, 5)
//     .flatMap(num => getData(num))
//     .toArray().toPromise();

//   return list;
// }

// console.clear();

// Rx.Observable.fromPromise(create()).subscribe(list => {
//   console.log(list);
// }, err => {
//   console.log(err);
// });
