
syncio.stringify = function(data) {

    var that = this, tof;

    return JSON.stringify(data, function(k, v) {

        tof = typeof v;

        if (tof == 'undefined')
            return that.stringify_undefined;

        else if (tof == 'function' && v.name !== '$syncio_remote_function')
            return that.stringify_function;

        else if (tof == 'object' && v instanceof RegExp)
            return that.stringify_regexp + v.toString();

        return v;

    });

};






// types = [
//     1,
//     undefined, 
//     null, 
//     function caca() {}, 
//     /^AB\/$/g, 
//     new RegExp("AB", "gi"),
//     new Date(),
//     {a: 12},
//     Symbol("caca"), 
// ];
// delete types[0];

// instance = {stringify_function:'~F', stringify_undefined:'~U', stringify_regexp:'~R'}
// stringify=stringify.bind(instance);
// to = stringify(types);
// // parse=parse.bind(instance);
// // from = parse(to);


// console.log(types);
// console.log(to);
// // console.log(from);





