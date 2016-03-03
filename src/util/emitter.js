

if (typeof require == 'function' && typeof require('events').EventEmitter == 'function')
    dop.util.emitter = require('events').EventEmitter;

else if (typeof EventEmitter == 'function')
    dop.util.emitter = EventEmitter.prototype;

else {

    dop.util.emitter = function() {

        this._events = {};

    };

    dop.util.emitter.prototype.on =
    dop.util.emitter.prototype.addListener = function( name, callback, once ) {

        if ( typeof callback == 'function' ) {

            if ( typeof this._events != 'object' )
                this._events = {};

            if ( typeof this._events[name] != 'object' )
                this._events[name] = [];

            this._events[name].push(
                (once === true) ? [ callback, true ] : [ callback ]
            );

        }

        return this;

    };

    dop.util.emitter.prototype.once =
    dop.util.emitter.prototype.addOnceListener = function( name, callback ) {

        return this.on( name, callback, true );

    };



    dop.util.emitter.prototype.emit = function( name ) {

        if ( typeof this._events[name] == 'object' && this._events[name].length > 0 ) {

            for ( var i=0, fun=[], args=Array.prototype.slice.call( arguments, 1 ); i < this._events[name].length; i++ ) {

                fun.push( this._events[name][i][0] );

                if ( this._events[name][i][1] === true ) {
                   this._events[name].splice( i, 1 ); 
                   i -= 1;
                }

            }

            for ( i=0; i < fun.length; i++ )
                fun[i].apply(this, args);

        }

        return this;

    };




    dop.util.emitter.prototype.removeListener = function( name, callback ) {

        if ( typeof this._events[name] == 'object' && this._events[name].length > 0 ) {

            for ( var i=0; i < this._events[name].length; i++ ) {

                if ( this._events[name][i][0] === callback ) {
                    this._events[name].splice( i, 1 ); 
                    i -= 1;
                }

            }


        }

        return this;

    };

}






/*
name = 'T@!#asty ';
emitter = new require('events').EventEmitter();
emitter = new dop.util.emitter();

emitter.on(name, function(){
    console.log('AAA', arguments.length); 
})

cached = function () { console.log('BBB',this._events[name].length); emitter.removeListener(name, cached) };
emitter.on(name, cached);
emitter.on(name, cached);

emitter.once(name, function(){
    console.log('CCC', this._events[name].length); 
})


emitter.emit(name);
emitter.emit(name, 2, 3);
emitter.emit(name, 4);
*/