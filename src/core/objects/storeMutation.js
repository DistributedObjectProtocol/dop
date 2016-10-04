
dop.core.storeMutation = function(mutation) {
    var collectors = dop.data.collectors,
        object_dop = dop.getObjectDop(mutation.object);
    object_dop.m.push(mutation);

    // Running collectors
    if (collectors.length > 0)
        for (var index=0,total=collectors.length; index<total; index++)
            if (collectors[index].callback===undefined || collectors[index].callback(mutation) === true)
                return collectors[index].mutations.push(mutation);

    return dop.dispatch([mutation]);        
};


// setTimeout(function(){
// console.clear();

// obj=dop.register({mola:123,array:[1,2,{obj:'lol'},4,5,6,7,8],old:"old"})
// arr=obj.array;
// str=dop.encode(obj);

// dop.observe(obj.array, console.log);
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
// // console.log(obj.array.slice(0), obj, unaction[3], collector.mutations.length );
// dop.setAction(unaction);
// console.log( str );
// console.log(dop.encode(obj), str===dop.encode(obj) );
// console.log(obj.array.slice(0), obj.array.length, arr===obj.array);

// },1000)