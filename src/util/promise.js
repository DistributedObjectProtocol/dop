

syncio.util.promise = function( resolver ) {

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


    function run( scope, params ) {
        
        if ( thens.length > 0 )
            loop.call(that, 0, scope, params);

        // If there is no thens added yet, we have to resolve/reject asynchronously
        else
            setTimeout(function() {
                loop.call(that, 0, scope, params);
            }, 0);
    }


    function loop( i, scope, params ) {

        var iplus = i+1;

        if ( typeof thens[i] == 'object' && typeof thens[i][that.type] == 'function' ) {

            try {

                params = [thens[i][that.type].apply(
                    ( thens[i][that.type].hasToGoUp ) ? that : scope, // 2.2.5 `onFulfilled` and `onRejected` must be called as functions (i.e. with no `that` value).
                    params
                )];

                if (that.type && !type)
                    that.type = 0;

            }
            catch (e) {
                that.type = 1;
                params = [e];
            }



            // 2.3.1. If promise and x refer to the same object, reject promise with a TypeError as the reason.
            if (params[0] === that) {
                that.type = 1;
                params[0] = new TypeError("Promise resolved by its own instance");
            }


            // 2.3.2. If x is a promise, adopt its state 
            else if ( params[0] instanceof that.constructor ) {
                var goingup = function(){
                    that.type = this.type;
                    loop.call(that, iplus, scope, arguments);
                };
                goingup.hasToGoUp = true;
                params[0].then(goingup, goingup);
                return;
            }

            /*
            // 2.3.3: Otherwise, if `x` is an object or function
            else if ( params[0] !== null && (typeof params[0] == 'object' || typeof params[0] == 'function') ) {

                try {
                    // 
                    var then = params[0].then;
                    console.log(typeof then)
                } catch (e) {
                    // 2.3.3.2. If retrieving the property x.then results in a thrown exception e, reject promise with e as the reason.
                    params[0] = e;
                    return that.loop.call(that, iplus, scope, params);
                }

                if ( typeof then == 'function' ) {
                    // 2.3.3.3. If then is a function, call it
                    var called = false;
                    var resolvePromise = function(y) {
                    // console.log(iplus, params)
                        // 2.3.3.3.1. If/when resolvePromise is called with a value y, run [[Resolve]](promise, y).
                        if (called) { return; }
                        called = true;
                        return loop.call(that, iplus, scope, params);
                    }
                    var rejectPromise = function(r) {
                    // console.log(22222)
                        // 2.3.3.3.2. If/when rejectPromise is called with a reason r, reject promise with r.
                        if (called) { return; }
                        called = true;
                        that.type = 1;
                        return loop.call(that, iplus, scope, params);
                    }

                    try {
                        then.call(params[0], resolvePromise.bind(that), rejectPromise.bind(that));
                    } catch (e) { // 2.3.3.3.4. If calling then throws an exception e,
                        // console.log(333333)
                        // 2.3.3.3.4.1. If resolvePromise or rejectPromise have been called, ignore it.
                        if (called) { return; }
                        // 2.3.3.3.4.2. Otherwise, reject promise with e as the reason.
                        that.type = 1;
                        return loop.call(that, iplus, scope, params);
                    }

                }

            }
            */

        }

        // Next .then()
        if ( iplus < thens.length )
            loop(iplus, scope, params);

    }


    if ( typeof resolver == 'function' )
        resolver(
            // that.resolve.bind(null) # 3.2 That is, in strict mode that will be undefined inside of them; in sloppy mode, it will be the global object.
            that.resolve, 
            that.reject
        );

};

// syncio.util.promise.resolve = function(value) {
//     return new this(function(resolve, reject) {
//         resolve(value);
//     });
// };

// syncio.util.promise.reject = function(reason) {
//     return new this(function(resolve, reject) {
//         reject(reason);
//     });
// };
