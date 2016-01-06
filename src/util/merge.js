
// Based on: https://github.com/unclechu/node-deep-extend (Performace: http://jsperf.com/deepmerge-comparisions/3)
syncio.merge = (function() {

    return function merge(first, second) {

        var args = arguments,
            key, val, src, clone;

        if (args.length < 2) return first;

        if (args.length > 2) {
            // Remove the first 2 arguments of the arguments and add thoose arguments as merged at the begining
            Array.prototype.splice.call(args, 0, 2, merge(first, second));
            // Recursion
            return merge.apply(this, args);
        }


        for (key in second) {

            if (!(key in second)) continue;

            src = first[key];
            val = second[key];

            if (val === first) continue;

            if ( val === null || (typeof val != 'object' && !Array.isArray(val)) || val instanceof Date || val instanceof RegExp ) {
            //if (!first.hasOwnProperty(key) || (typeof val !== 'object' && !Array.isArray(val))) {
                first[key] = val;
                continue;
            }


            if ( typeof src !== 'object' || src === null ) {
                clone = (Array.isArray(val)) ? [] : {};
                first[key] = merge(clone, val);
                continue;
            }

            // // This lines do not allow merge
            // clone = (Array.isArray(val)) ?

            //     (Array.isArray(src)) ? src : []
            // :
            //     (!Array.isArray(src)) ? src : {};

            clone = src;

            first[key] = merge(clone, val);

        }

        return first;
    }

})();




// var obj1 = {
//     a: 11,
//     b: 12,
//     array: [1,2,3,{abc:123}],
//     d: {
//         d1: 13,
//         d2: {
//             d21: 123,
//             d22: {
//                 d221: 12,
//                 d223: { 
//                   hola: 'hola',
//                   static: 'static'
//                 }
//             }
//         }
//     },
//     arrobj: ['a','b','c','d'],
//     f: 5,
//     g: 123
// };
// var obj2 = {
//     b: 3,
//     c: 5,
//     obj: {lolo:111},
//     fun: function(){},
//     arr: [1,2,3,{La:123}],
//     array: [567],
//     arrobj: {0:1,1:2},
//     d: {
//         d2: {
//             d22: {
//                 d222: 25,
//                 d223: {
//                   hola:'mundo'
//                 }
//             }
//         }
//     },

// };
// var data = {
//     types: [
//         123,
//         true,
//         'my string',
//         'string to be deleted',
//         undefined, 
//         null,
//         function caca() {}, 
//         /^A\wB$/g, 
//         new RegExp("AB", "gi"),
//         new Date(),
//         {a: 12},
//         Symbol("caca"), 
//     ]
// };
// delete data.types[3];
// console.log(syncio.merge({},data));

// resu=syncio.merge(obj1, obj2, );
// console.log( resu );
// console.log( resu.obj === obj2.obj );
// console.log( resu.fun === obj2.fun );
// console.log( resu.arr === obj2.arr );











// // Based in syncio.path && syncio.get.set
// syncio.merge = (function() {

//     var destiny;

//     function callback(path, value){

//         if ( value && typeof value == 'object' )

//             value = (Array.isArray( value )) ? [] : {};

//         syncio.get.set(destiny, path, value);

//     };

//     return function merge(first, second) {

//         var args = arguments;

//         if (args.length > 2) {
//             // Remove the first 2 arguments of the arguments and add thoose arguments as merged at the begining
//             Array.prototype.splice.call(args, 0, 2, merge(first, second));
//             // Recursion
//             return merge.apply(this, args);
//         }

//         destiny = first;

//         syncio.path(second, callback);

//         return first;

//     };

// })();


