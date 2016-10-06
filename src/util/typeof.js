
dop.util.typeof = function(value) {
    var s = typeof value;
    if (s == 'object') {
        if (value) {
            if (Array.isArray(value))
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


/*
dop.util.typeof = (function() {
    
    var list = {

        '[object Null]': 'null',
        '[object Undefined]': 'undefined',
        '[object Object]': 'object',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Boolean]': 'boolean',
        '[object Symbol]': 'symbol'

    };


    return function(type) {

        return list[ Object.prototype.toString.call(type) ];

    };


})();
*/

