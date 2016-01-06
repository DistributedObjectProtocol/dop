

syncio.util.get = function ( obj, path, callback_create ) {

    for (var i=0, l=path.length; i<l-1; i++) {

        if ( obj[ path[i] ] !== null && typeof obj[ path[i] ] == 'object' )
            obj = obj[ path[i] ];

        else if ( callback_create && callback_create(obj, path[i], i) )
            obj[ path[i] ] = {};

        else
            return obj;

    }

    return obj[ path[i] ];

};


/*

syncio.util.get.set = function ( obj, path, value, callback_create ) {

    path = path.slice(0);
    var prop = path.pop();

    obj = syncio.util.get(obj, path, callback_create);

    obj[prop] = value;

    return obj

};


syncio.util.get.delete = function ( obj, path, callback_create ) {

    path = path.slice(0);
    var prop = path.pop();

    obj = syncio.util.get(obj, path);

    ( syncio.util.typeof(obj) == 'array' && !isNaN(prop) ) ?
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
resu = syncio.util.get(obj1, ['d', 'd2', 'd1','a'], function(obj, property, i){ 
    exists = false;
    // console.log(obj.hasOwnProperty(property), i); 
    return !obj.hasOwnProperty(property); 
    return false;
});

console.log('RESU:',exists,resu,obj1)


*/
