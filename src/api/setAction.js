
dop.setAction = function( action ) {
    var collector = dop.collect();
    dop.util.path(action, function(source, prop, value, path, destiny) {
        if (dop.isRegistered(destiny) && (dop.isRegistered(value) || !dop.util.isObject(value))) {
            (value===undefined) ? 
                dop.delete(destiny, prop)
            : 
                dop.set(destiny, prop, value);
        }
    }, dop.data.object, false);
    return collector.dispatch();
};





// setTimeout(function(){
// console.clear();

// obj=dop.register({mola:123,array:[1,2,{obj:'lol'},4,5,6,7,8],old:"old"})
// str=dop.encode(obj);
// console.log(obj.array.slice(0), obj.array.length);

// collector = dop.collect();
// obj.new='yeah';
// delete obj.old;
// obj.array.shift();
// obj.array.splice(2,2,'coca','cola');
// obj.array.reverse();
// obj.array.push({last:9});
// collector.dispatch();

// unaction = dop.getUnaction(collector.mutations);
// console.log(obj.array.slice(0), obj, unaction[3], collector.mutations.length );
// dop.setAction(unaction);
// console.log( str );
// console.log(dop.encode(obj), str===dop.encode(obj) );

// },1000)

