
dop.core.encode = function(k, v) {

    var tof = typeof v;

    if (tof == 'function')
        return '~F';

    else if ( v === Infinity )
        return '~I';

    else if ( v === -Infinity )
        return '~i';
    
    else if ( tof == 'number' && isNaN(v) )
        return '~N';

    else if (tof == 'object' && v instanceof RegExp)
        return '~R' + v.toString();

    // else if (tof == 'undefined') // http://stackoverflow.com/questions/17648150/how-does-json-parse-manage-undefined
        // return '~U';

    return v;

};



// dop.core._encode = dop.core.encode;
// dop.core.encode = function(k, v) {

//     // console.log(k, v)
//     if (typeof v == 'function')
//         return '~FUUUUUUUNCTION';

//     return dop.core._encode(k,v);

// };