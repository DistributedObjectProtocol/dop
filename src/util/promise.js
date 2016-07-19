

dop.util.promise = function( resolver ) {

    var thens = [],
        state = 0, /* 0 = pending, 1 = fulfilled, 2 = rejected, 3 = completed/canceled */
        type,
        onCompleted,
        that = this;

    this.state = state;


    this.then = function(onFulfilled, onRejected) {

        if (typeof onFulfilled == 'function')
            thens.push([onFulfilled]);
        if (typeof onRejected == 'function')
            thens.push([undefined, onRejected]);

        return this;
        // if ( this._chain )
        //     var that = this;
        // else{
        //     var that = Object.create(this);
        //     that._chain = 0;
        // }

        // that._chain++;
        // return that;
    };


    this.catch = function(onRejected) {
        return that.then(0, onRejected);
    };


    this.completed = function( completedCallback ) {
        onCompleted = completedCallback;
        return that;
    };


    this.resolve = function() {
        // if (state != 0) return that; // https://promisesaplus.com/#point-14
        if (state === 3) return that;
        state = that.state = 1;
        type = that.type = 0;
        run(this, arguments);
    };

    this.reject = function() {
        // if (state != 0) return that; // https://promisesaplus.com/#point-17
        if (state === 3) return that;
        state = that.state = 2;
        type = that.type = 1;
        run(this, arguments);
    };

    that.onCompleted = function() {
        state = that.state = 3;
        if ( typeof onCompleted == 'function' )
            onCompleted.apply(this, arguments);
    };


    function run( scope, args ) {
        
        if ( thens.length > 0 )
            loop.call(that, 0, scope, args);

        // If there is no thens added yet, we have to resolve/reject asynchronously
        else
            setTimeout(function() {
                loop.call(that, 0, scope, args);
            }, 0);
    }


    function loop( i, scope, args ) {

        var iplus = i+1;

        if ( typeof thens[i] == 'object' && typeof thens[i][that.type] == 'function' ) {

            try {

                args = [thens[i][that.type].apply(
                    ( thens[i][that.type].hasToGoUp ) ? that : scope, // 2.2.5 `onFulfilled` and `onRejected` must be called as functions (i.e. with no `that` value).
                    args
                )];

                if (that.type && !type)
                    that.type = 0;

            }
            catch (e) {
                that.type = 1;
                args = [e];
            }



            // 2.3.1. If promise and x refer to the same object, reject promise with a TypeError as the reason.
            if (args[0] === that) {
                that.type = 1;
                args[0] = new TypeError("Promise resolved by its own instance");
            }


            // 2.3.2. If x is a promise, adopt its state 
            else if ( args[0] instanceof that.constructor ) {
                var goingup = function(){
                    that.type = this.type;
                    loop.call(that, iplus, scope, arguments);
                };
                goingup.hasToGoUp = true;
                args[0].then(goingup, goingup);
                return;
            }

            /*
            // 2.3.3: Otherwise, if `x` is an object or function
            else if ( args[0] !== null && (typeof args[0] == 'object' || typeof args[0] == 'function') ) {

                try {
                    // 
                    var then = args[0].then;
                    console.log(typeof then)
                } catch (e) {
                    // 2.3.3.2. If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
                    args[0] = e;
                    return that.loop.call(that, iplus, scope, args);
                }

                if ( typeof then == 'function' ) {
                    // 2.3.3.3. If then is a function, call it
                    var called = false;
                    var resolvePromise = function(y) {
                    // console.log(iplus, args)
                        // 2.3.3.3.1. If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
                        if (called) { return; }
                        called = true;
                        return loop.call(that, iplus, scope, args);
                    }
                    var rejectPromise = function(r) {
                    // console.log(22222)
                        // 2.3.3.3.2. If/when rejectPromise is called with a reason r, reject promise with r.
                        if (called) { return; }
                        called = true;
                        that.type = 1;
                        return loop.call(that, iplus, scope, args);
                    }

                    try {
                        then.call(args[0], resolvePromise.bind(that), rejectPromise.bind(that));
                    } catch (e) { // 2.3.3.3.4. If calling then throws an exception e,
                        // console.log(333333)
                        // 2.3.3.3.4.1. If resolvePromise or rejectPromise have been called, ignore it.
                        if (called) { return; }
                        // 2.3.3.3.4.2. Otherwise, reject promise with e as the reason.
                        that.type = 1;
                        return loop.call(that, iplus, scope, args);
                    }

                }

            }
            */

        }

        // Next .then()
        if ( iplus < thens.length )
            loop(iplus, scope, args);

    }


    if ( typeof resolver == 'function' )
        resolver(
            // that.resolve.bind(null) # 3.2 That is, in strict mode that will be undefined inside of them; in sloppy mode, it will be the global object.
            that.resolve, 
            that.reject
        );

};

// dop.util.promise.resolve = function(value) {
//     return new this(function(resolve, reject) {
//         resolve(value);
//     });
// };

// dop.util.promise.reject = function(reason) {
//     return new this(function(resolve, reject) {
//         reject(reason);
//     });
// };


/*
dop.util.promise = function () {
    var resolve, reject,
    promise = new Promise(function(res, rej){
        resolve = res;
        reject = rej;
    });
    promise.resolve = resolve;
    promise.reject = reject;
    return promise;
};

pro = dop.util.promise();
pro.then(function(v){
    console.log('yeah',v)
});
pro.resolve(1235667)
*/


