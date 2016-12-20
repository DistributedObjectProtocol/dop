// https://jsperf.com/typeof-with-more-types
// dop={util:{}}
dop.util.typeof = function(value) {
    var s = typeof value;
    if (s == 'object') {
        if (value) {
            if (isArray(value))
                s = 'array';
            else if (value instanceof Date)
                s = 'date';
            else if (value instanceof RegExp)
                s = 'regexp';
        }
        else
            s = 'null';
    }
    return s;
};



// dop.util.typeof2 = (function() {
    
//     var list = {

//         '[object Null]': 'null',
//         '[object Undefined]': 'undefined',
//         '[object Object]': 'object',
//         '[object Function]': 'function',
//         '[object Array]': 'array',
//         '[object Number]': 'number',
//         '[object String]': 'string',
//         '[object Boolean]': 'boolean',
//         '[object Symbol]': 'symbol',
//         '[object RegExp]': 'regexp',
//         '[object Date]': 'date'
//     };


//     return function(type) {

//         return list[ Object.prototype.toString.call(type) ];

//     };


// })();

// Typeof=dop.util.typeof;
// console.log(Typeof(null));
// console.log(Typeof(undefined));
// console.log(Typeof({}));
// console.log(Typeof(function(){}));
// console.log(Typeof([]));
// console.log(Typeof(1));
// console.log(Typeof("s"));
// console.log(Typeof(true));
// console.log(Typeof(/a/));
// console.log(Typeof(new Date()));
// console.log(Typeof(Symbol('')));
// console.log(Typeof(new Typeof));


// Typeof(null);
// Typeof(undefined);
// Typeof({});
// Typeof(function(){});
// Typeof([]);
// Typeof(1);
// Typeof("s");
// Typeof(true);
// Typeof(/a/);
// Typeof(new Date());
// Typeof(Symbol(''));
// Typeof(new Typeof);

