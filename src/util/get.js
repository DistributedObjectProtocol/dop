
dop.util.get = function( obj, path ) {

    if ( path.length == 0 )
        return obj;

    for (var i=0, l=path.length; i<l; i++) {

        if ( i+1<l && obj[ path[i] ] !== null && dop.util.isObject(obj[ path[i] ]) )
            obj = obj[ path[i] ];

        else if ( obj.hasOwnProperty(path[i]) )
            return obj[ path[i] ];

        else
            return undefined;

    }

    return obj[ path[i] ];

};


// dop.util.set = function( obj, path, value ) {

//     path = path.slice(0);
//     var prop = path.pop();

//     obj = dop.util.get(obj, path, function(){return true});

//     obj[prop] = value;

//     return obj

// };

/*
dop.util.get.delete = function( obj, path, callback_create ) {

    path = path.slice(0);
    var prop = path.pop();

    obj = dop.util.get(obj, path);

    ( dop.util.typeof(obj) == 'array' && !isNaN(prop) ) ?
        obj.splice(prop, 1)
    :
        delete obj[prop];

    return obj

};


var obj1 = {
    a: 11,
    b: 12,
    array: [1,2,3,{abc:123}],
    d: {
        d1: 13,
        n: null, 
        d2: {
            d21: 123,
            u: undefined,
            d22: {
                d221: 12,
                d223: { 
                  hola: 'hola',
                  static: 'static'
                }
            }
        }
    },
    arrobj: ['a','b','c','d'],
    f: 5,
    g: 123
};

exists = true;
resu = dop.util.get(obj1, ['d', 'd2', 'd1','a'], function(obj, property, i){ 
    exists = false;
    // console.log(obj.hasOwnProperty(property), i); 
    return !obj.hasOwnProperty(property);  // If the path does not exists and we return true, the path will be create to set the property
    return false;
});

console.log('RESU:',exists,resu,obj1)

*/


